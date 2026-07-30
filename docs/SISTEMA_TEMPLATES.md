# Sistema de Templates WordPress-style para Laravel + Inertia + React

## Resumen

Sistema que permite subir plantillas (layouts) vía ZIP desde el panel admin, activarlas por tipo de página (landing, dashboard, auth, forms) y renderizarlas dinámicamente en el frontend usando `import.meta.glob` de Vite.

No copia archivos al activar. Solo actualiza la base de datos. El frontend descubre todos los templates automáticamente.

---

## 1. Estructura de carpetas final

```
resources/js/layouts/
├── default/                        # Templates base del sistema (protegidos)
│   ├── landing/                    # type: landing
│   │   ├── landing-template.tsx    # Entry point
│   │   ├── landing-layout.tsx      # Layout real
│   │   ├── landing-header.tsx
│   │   ├── landing-footer.tsx
│   │   ├── landing-topmenu.tsx
│   │   ├── landing.json            # Manifiesto
│   │   └── thumbnails/preview.png
│   ├── dashboard/
│   │   ├── dashboard-template.tsx
│   │   ├── dashboard-layout.tsx
│   │   ├── dashboard-sidebar.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── dashboard-footer.tsx
│   │   ├── dashboard.json
│   │   └── thumbnails/preview.png
│   ├── full/
│   │   ├── full-template.tsx
│   │   ├── full-layout.tsx
│   │   ├── landing/landing-layout.tsx
│   │   ├── dashboard/dashboard-layout.tsx
│   │   ├── full.json
│   │   └── thumbnails/preview.png
│   ├── auth/
│   │   ├── auth-template.tsx
│   │   ├── auth-layout.tsx
│   │   ├── auth.json
│   │   └── thumbnails/preview.png
│   └── forms/
│       ├── forms-template.tsx
│       ├── forms-layout.tsx
│       ├── forms.json
│       └── thumbnails/preview.png
├── aurora/                         # Template subido por usuario
│   ├── aurora-template.tsx
│   ├── aurora-layout.tsx
│   ├── aurora-header.tsx
│   ├── aurora-footer.tsx
│   ├── aurora.json
│   └── thumbnails/preview.png
```

---

## 2. Migraciones

### create_layout_templates_table

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('layout_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type'); // landing, dashboard, auth, forms, full
            $table->string('version')->default('1.0.0');
            $table->string('author')->default('Unknown');
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('config')->nullable();
            $table->boolean('is_protected')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('layout_templates');
    }
};
```

### create_layout_assignments_table

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('layout_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('layout_templates');
            $table->string('page_type'); // landing, dashboard, auth, forms
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('layout_assignments');
    }
};
```

---

## 3. Modelos

### app/Models/LayoutTemplate.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\File;

class LayoutTemplate extends Model
{
    protected $fillable = [
        'name', 'slug', 'type', 'version', 'author',
        'description', 'thumbnail', 'config', 'is_protected',
    ];

    protected function casts(): array
    {
        return [
            'config' => 'array',
            'is_protected' => 'boolean',
        ];
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(LayoutAssignment::class, 'template_id');
    }

    protected static function booted(): void
    {
        static::deleting(function ($template) {
            $template->assignments()->delete();

            $dir = resource_path("js/layouts/{$template->slug}");
            if (File::exists($dir)) {
                File::deleteDirectory($dir);
            }

            $thumbDir = storage_path("app/public/templates/{$template->slug}");
            if (File::exists($thumbDir)) {
                File::deleteDirectory($thumbDir);
            }
        });
    }
}
```

### app/Models/LayoutAssignment.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LayoutAssignment extends Model
{
    protected $fillable = ['template_id', 'page_type'];

    public function template(): BelongsTo
    {
        return $this->belongsTo(LayoutTemplate::class, 'template_id');
    }
}
```

---

## 4. Servicio TemplateManager

### app/Services/TemplateManager.php

```php
<?php

namespace App\Services;

use App\Models\LayoutAssignment;
use App\Models\LayoutTemplate;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use RuntimeException;
use ZipArchive;

class TemplateManager
{
    protected string $layoutsPath;

    public function __construct()
    {
        $this->layoutsPath = resource_path('js/layouts');
    }

    public function install(UploadedFile $file): LayoutTemplate
    {
        $zip = new ZipArchive;

        if ($zip->open($file->getRealPath()) !== true) {
            throw new RuntimeException('No se pudo abrir el archivo ZIP.');
        }

        // Find root folder from ZIP entries
        $entries = [];
        for ($i = 0; $i < $zip->numEntries; $i++) {
            $entries[] = $zip->statIndex($i)['name'];
        }

        $rootFolder = null;
        foreach ($entries as $entry) {
            if (str_contains($entry, '/') && !str_starts_with($entry, '__MACOSX')) {
                $rootFolder = explode('/', $entry)[0];
                break;
            }
        }

        if (!$rootFolder) {
            throw new RuntimeException('El ZIP debe contener una carpeta raíz con el nombre del template.');
        }

        // Find manifest: {rootFolder}.json
        $manifestJson = $zip->getFromName("{$rootFolder}/{$rootFolder}.json");
        if ($manifestJson === false) {
            $zip->close();
            throw new RuntimeException("El ZIP no contiene '{$rootFolder}.json'.");
        }

        $manifest = json_decode($manifestJson, true);
        if (!isset($manifest['name'])) {
            $zip->close();
            throw new RuntimeException('El manifiesto debe contener al menos el campo "name".');
        }

        $slug = $manifest['slug'] ?? Str::slug($manifest['name']);
        if (LayoutTemplate::where('slug', $slug)->exists()) {
            $zip->close();
            throw new RuntimeException("Ya existe un template con slug '{$slug}'.");
        }

        $type = $manifest['type'] ?? 'full';
        $this->validateType($type);

        $extractTo = "{$this->layoutsPath}/{$slug}";
        if (File::exists($extractTo)) {
            $zip->close();
            throw new RuntimeException("Ya existe la carpeta para '{$slug}'.");
        }

        File::ensureDirectoryExists($extractTo);

        for ($i = 0; $i < $zip->numEntries; $i++) {
            $stat = $zip->statIndex($i);
            $name = $stat['name'];
            if (str_starts_with($name, '__MACOSX')) continue;
            if (str_starts_with($name, "{$rootFolder}/")) {
                $relativePath = substr($name, strlen($rootFolder) + 1);
                if (empty($relativePath)) continue;
                if (str_ends_with($name, '/')) {
                    File::ensureDirectoryExists("{$extractTo}/{$relativePath}");
                } else {
                    File::ensureDirectoryExists(dirname("{$extractTo}/{$relativePath}"));
                    copy("zip://{$file->getRealPath()}#{$name}", "{$extractTo}/{$relativePath}");
                }
            }
        }

        $zip->close();
        $this->validateStructure($extractTo, $manifest, $slug);

        // Copy thumbnail to public storage
        $thumbnail = null;
        $thumbnailPath = "{$extractTo}/thumbnails/preview.png";
        if (File::exists($thumbnailPath)) {
            $storageThumbDir = storage_path("app/public/templates/{$slug}");
            File::ensureDirectoryExists($storageThumbDir);
            File::copy($thumbnailPath, "{$storageThumbDir}/preview.png");
            $thumbnail = "templates/{$slug}/preview.png";
        }

        return LayoutTemplate::create([
            'name' => $manifest['name'],
            'slug' => $slug,
            'type' => $type,
            'version' => $manifest['version'] ?? '1.0.0',
            'author' => $manifest['author'] ?? 'Unknown',
            'description' => $manifest['description'] ?? null,
            'thumbnail' => $thumbnail,
            'config' => $manifest['components'] ?? null,
        ]);
    }

    public function activate(LayoutTemplate $template, string $pageType): void
    {
        $allowedTypes = $this->getAllowedPageTypes($template->type);
        if (!in_array($pageType, $allowedTypes)) {
            throw new RuntimeException(
                "El template '{$template->name}' es tipo '{$template->type}' y no puede asignarse a '{$pageType}'."
            );
        }

        LayoutAssignment::updateOrCreate(
            ['page_type' => $pageType],
            ['template_id' => $template->id]
        );
    }

    public function deactivate(string $pageType): void
    {
        LayoutAssignment::where('page_type', $pageType)->delete();
    }

    public function uninstall(LayoutTemplate $template): void
    {
        if ($template->is_protected) {
            throw new RuntimeException("El template '{$template->name}' es base del sistema y no puede eliminarse.");
        }

        $dir = "{$this->layoutsPath}/{$template->slug}";
        if (File::exists($dir)) {
            File::deleteDirectory($dir);
        }

        $thumbDir = storage_path("app/public/templates/{$template->slug}");
        if (File::exists($thumbDir)) {
            File::deleteDirectory($thumbDir);
        }

        $template->assignments()->delete();
        $template->delete();
    }

    public function getActiveTemplate(string $pageType): ?LayoutTemplate
    {
        return LayoutAssignment::where('page_type', $pageType)->first()?->template;
    }

    public function getActiveTemplates(): array
    {
        return LayoutAssignment::with('template')
            ->get()
            ->mapWithKeys(fn($a) => [$a->page_type => $a->template])
            ->toArray();
    }

    public function buildZipTemplate(string $slug): string
    {
        $sourceDir = "{$this->layoutsPath}/{$slug}";
        if (!File::exists($sourceDir)) {
            throw new RuntimeException("Template '{$slug}' no encontrado en layouts.");
        }

        $zipPath = storage_path("app/templates/{$slug}.zip");
        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new RuntimeException('No se pudo crear el ZIP.');
        }

        foreach (File::allFiles($sourceDir) as $file) {
            $zip->addFile($file->getRealPath(), "{$slug}/" . $file->getRelativePathname());
        }

        $zip->close();
        return $zipPath;
    }

    protected function validateStructure(string $extractTo, array $manifest, string $slug): void
    {
        $required = ["{$slug}.json", "{$slug}-template.tsx"];
        foreach ($required as $file) {
            if (!File::exists("{$extractTo}/{$file}")) {
                File::deleteDirectory($extractTo);
                throw new RuntimeException("Estructura inválida: falta '{$file}'.");
            }
        }

        foreach (($manifest['components'] ?? []) as $key => $path) {
            if (!File::exists("{$extractTo}/{$path}")) {
                File::deleteDirectory($extractTo);
                throw new RuntimeException("Componente '{$key}' no encontrado en '{$path}'.");
            }
        }
    }

    protected function validateType(string $type): void
    {
        $validTypes = ['landing', 'dashboard', 'auth', 'forms', 'full'];
        if (!in_array($type, $validTypes)) {
            throw new RuntimeException("Tipo inválido: '{$type}'. Válidos: " . implode(', ', $validTypes));
        }
    }

    public function getAllowedPageTypes(string $type): array
    {
        return match ($type) {
            'landing' => ['landing'],
            'dashboard' => ['dashboard'],
            'auth' => ['auth'],
            'forms' => ['forms'],
            'full' => ['landing', 'dashboard', 'auth', 'forms'],
            default => [],
        };
    }

    public function getTypeLabel(string $type): string
    {
        return match ($type) {
            'landing' => 'Landing Page',
            'dashboard' => 'Dashboard',
            'auth' => 'Autenticación',
            'forms' => 'Formularios',
            'full' => 'Full',
            default => ucfirst($type),
        };
    }
}
```

---

## 5. Controlador

### app/Http/Controllers/Admin/TemplateController.php

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTemplateRequest;
use App\Models\LayoutTemplate;
use App\Services\TemplateManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TemplateController extends Controller
{
    public function __construct(
        protected TemplateManager $templateManager,
    ) {}

    public function index(): Response
    {
        $templates = LayoutTemplate::with('assignments')->get()->map(fn($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'slug' => $t->slug,
            'type' => $t->type,
            'type_label' => $this->templateManager->getTypeLabel($t->type),
            'version' => $t->version,
            'author' => $t->author,
            'description' => $t->description,
            'thumbnail' => $t->thumbnail ? asset("storage/{$t->thumbnail}") : null,
            'is_protected' => $t->is_protected,
            'is_active' => $t->assignments->isNotEmpty(),
            'assigned_to' => $t->assignments->pluck('page_type'),
            'allowed_page_types' => $this->templateManager->getAllowedPageTypes($t->type),
            'created_at' => $t->created_at->diffForHumans(),
        ]);

        $activeTemplates = $this->templateManager->getActiveTemplates();

        return Inertia::render('admin/templates/index', [
            'templates' => $templates,
            'activeTemplates' => $activeTemplates,
            'pageTypes' => [
                ['value' => 'landing', 'label' => 'Landing Page'],
                ['value' => 'dashboard', 'label' => 'Dashboard'],
                ['value' => 'auth', 'label' => 'Autenticación'],
                ['value' => 'forms', 'label' => 'Formularios'],
            ],
        ]);
    }

    public function store(StoreTemplateRequest $request): RedirectResponse
    {
        try {
            $template = $this->templateManager->install($request->file('template'));

            return redirect()->route('admin.templates.index')
                ->with('flash', ['success' => "Template '{$template->name}' instalado."]);
        } catch (\RuntimeException $e) {
            return redirect()->back()
                ->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function activate(Request $request, LayoutTemplate $template): RedirectResponse
    {
        $request->validate([
            'page_type' => ['required', 'string', 'in:landing,dashboard,auth,forms'],
        ]);

        try {
            $this->templateManager->activate($template, $request->page_type);

            return redirect()->route('admin.templates.index')
                ->with('flash', ['success' => "Template '{$template->name}' activado para {$request->page_type}."]);
        } catch (\RuntimeException $e) {
            return redirect()->back()
                ->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function deactivate(Request $request): RedirectResponse
    {
        $request->validate([
            'page_type' => ['required', 'string', 'in:landing,dashboard,auth,forms'],
        ]);

        $this->templateManager->deactivate($request->page_type);

        return redirect()->route('admin.templates.index')
            ->with('flash', ['success' => 'Template desactivado.']);
    }

    public function destroy(LayoutTemplate $template): RedirectResponse
    {
        try {
            $this->templateManager->uninstall($template);

            return redirect()->route('admin.templates.index')
                ->with('flash', ['success' => "Template '{$template->name}' eliminado."]);
        } catch (\RuntimeException $e) {
            return redirect()->back()
                ->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function download(LayoutTemplate $template): BinaryFileResponse
    {
        $zipPath = $this->templateManager->buildZipTemplate($template->slug);

        return response()->download($zipPath, "{$template->slug}.zip")->deleteFileAfterSend();
    }

    public function upload(): Response
    {
        return Inertia::render('admin/templates/upload');
    }

    public function assign(): RedirectResponse
    {
        return redirect()->route('admin.templates.index');
    }
}
```

---

## 6. Form Request

### app/Http/Requests/Admin/StoreTemplateRequest.php

```php
<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'template' => ['required', 'file', 'mimes:zip', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'template.required' => 'Debes seleccionar un archivo ZIP.',
            'template.mimes' => 'Solo se permiten archivos ZIP.',
            'template.max' => 'El archivo no puede superar los 10MB.',
        ];
    }
}
```

---

## 7. Rutas

### routes/admin.php

```php
<?php

use App\Http\Controllers\Admin\TemplateController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/templates', [TemplateController::class, 'index'])->name('templates.index');
    Route::get('/templates/assign', [TemplateController::class, 'assign'])->name('templates.assign');
    Route::get('/templates/upload', [TemplateController::class, 'upload'])->name('templates.upload');
    Route::post('/templates', [TemplateController::class, 'store'])->name('templates.store');
    Route::post('/templates/{template}/activate', [TemplateController::class, 'activate'])->name('templates.activate');
    Route::post('/templates/deactivate', [TemplateController::class, 'deactivate'])->name('templates.deactivate');
    Route::get('/templates/{template}/download', [TemplateController::class, 'download'])->name('templates.download');
    Route::delete('/templates/{template}', [TemplateController::class, 'destroy'])->name('templates.destroy');
});
```

### bootstrap/app.php

Incluir las rutas admin en el archivo de boostrap:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
    then: function () {
        Route::middleware('web')->group(base_path('routes/admin.php'));
    },
)
```

Agregar el import al inicio del archivo:

```php
use Illuminate\Support\Facades\Route;
```

---

## 8. Middleware: Compartir activeTemplates

### app/Http/Middleware/HandleInertiaRequests.php

```php
<?php

namespace App\Http\Middleware;

use App\Services\TemplateManager;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $templateManager = app(TemplateManager::class);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => ['user' => $request->user()],
            'activeTemplates' => $templateManager->getActiveTemplates(),
        ];
    }
}
```

---

## 9. Frontend: Resolver de templates

### resources/js/lib/template-resolver.ts

```ts
import { lazy } from 'react';

const templateFiles = import.meta.glob<{ default: React.ComponentType<any> }>(
    '/resources/js/layouts/**/*-template.tsx',
);

const templateMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {};
for (const [path, loader] of Object.entries(templateFiles)) {
    // Matches: layouts/default/landing/landing-template.tsx → "landing"
    // Matches: layouts/aurora/aurora-template.tsx → "aurora"
    const match = path.match(/\/layouts\/(?:default\/)?([^/]+)\/\1-template\.tsx$/);
    if (match) {
        templateMap[match[1]] = lazy(loader);
    }
}

export function getPageTypeFromUrl(url: string): string {
    if (url === '/' || url === '' || url.startsWith('/#')) return 'landing';
    if (url.startsWith('/auth/')) return 'auth';
    if (url.startsWith('/admin/') || url.startsWith('/dashboard')) return 'dashboard';
    return 'landing';
}

export function resolveActiveTemplate(
    activeSlug: string | null | undefined,
): React.LazyExoticComponent<React.ComponentType<any>> | null {
    if (!activeSlug) return null;
    return templateMap[activeSlug] ?? null;
}
```

### resources/js/layouts/app-layout.tsx

```tsx
import { Suspense } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { getPageTypeFromUrl, resolveActiveTemplate } from '@/lib/template-resolver';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { activeTemplates, url } = usePage<{
        activeTemplates: Record<string, { id: number; name: string; slug: string }>;
        url: string;
    }>();

    const pageType = getPageTypeFromUrl(url || '/');
    const activeSlug = activeTemplates?.[pageType]?.slug;
    const ActiveTemplate = resolveActiveTemplate(activeSlug);

    if (ActiveTemplate) {
        return (
            <Suspense fallback={
                <div className="flex min-h-screen items-center justify-center text-muted-foreground">
                    Cargando template...
                </div>
            }>
                <ActiveTemplate breadcrumbs={breadcrumbs}>{children}</ActiveTemplate>
            </Suspense>
        );
    }

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
```

### resources/js/layouts/auth-layout.tsx

```tsx
import { Suspense } from 'react';
import { usePage } from '@inertiajs/react';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { resolveActiveTemplate } from '@/lib/template-resolver';

export default function AuthLayout({
    title = '', description = '', children,
}: {
    title?: string; description?: string; children: React.ReactNode;
}) {
    const { activeTemplates } = usePage<{
        activeTemplates: Record<string, { id: number; name: string; slug: string }>;
    }>();

    const activeSlug = activeTemplates?.auth?.slug;
    const ActiveTemplate = resolveActiveTemplate(activeSlug);

    if (ActiveTemplate) {
        return (
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">Cargando template...</div>}>
                <ActiveTemplate>{children}</ActiveTemplate>
            </Suspense>
        );
    }

    return <AuthLayoutTemplate title={title} description={description}>{children}</AuthLayoutTemplate>;
}
```

---

## 10. Componentes Frontend

### TemplateCard — resources/js/components/template-card.tsx

```tsx
import { Palette, ShieldCheck, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateCardData {
    id: number; name: string; slug: string; type: string;
    type_label: string; version: string; author: string;
    description: string | null; thumbnail: string | null;
    is_protected: boolean; is_active: boolean;
    assigned_to: string[]; allowed_page_types: string[];
    created_at: string;
}

interface TemplateCardProps {
    template: TemplateCardData;
    isActive?: boolean;
    sectionPageType?: string;
    onActivate?: () => void;
    onDeactivate?: () => void;
    onDownload: (templateId: number) => void;
    onDelete: (templateId: number) => void;
}

const typeColors: Record<string, string> = {
    landing: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    dashboard: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    auth: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    forms: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    full: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
};

const typeLabels: Record<string, string> = {
    landing: 'Landing Page', dashboard: 'Dashboard',
    auth: 'Autenticación', forms: 'Formularios', full: 'Full',
};

export default function TemplateCard({
    template, isActive = false, sectionPageType,
    onActivate, onDeactivate, onDownload, onDelete,
}: TemplateCardProps) {
    const canDelete = !template.is_protected;

    return (
        <div className={cn(
            'group relative overflow-hidden rounded-xl border transition-all hover:shadow-md',
            isActive ? 'border-primary bg-primary/5' : 'border-border bg-card',
        )}>
            <div className="flex aspect-video items-center justify-center bg-muted">
                {template.thumbnail ? (
                    <img src={template.thumbnail} alt={template.name} className="h-full w-full object-cover" />
                ) : (
                    <Palette className="size-12 text-muted-foreground/40" />
                )}
            </div>

            <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="truncate font-semibold">{template.name}</h3>
                        <p className="text-xs text-muted-foreground">
                            v{template.version} por {template.author}
                        </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                        <span className={cn(
                            'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium',
                            typeColors[template.type] ?? 'bg-primary/10 text-primary',
                        )}>
                            {template.type_label}
                        </span>
                        {template.is_protected && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                <ShieldCheck className="size-3" /> Default
                            </span>
                        )}
                    </div>
                </div>

                {template.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                )}

                {template.type === 'full' && (
                    <div className="flex flex-wrap gap-1">
                        {template.allowed_page_types.map((pt) => (
                            <span key={pt} className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                                typeColors[pt],
                            )}>
                                {typeLabels[pt] ?? pt}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                    {sectionPageType && onActivate && (
                        isActive ? (
                            <button onClick={onDeactivate}
                                className="flex items-center gap-1 rounded-md border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10">
                                Desactivar
                            </button>
                        ) : (
                            <button onClick={onActivate}
                                className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90">
                                <Check className="size-3" /> Activar
                            </button>
                        )
                    )}
                    <button onClick={() => onDownload(template.id)}
                        className="rounded-md border border-input px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent">
                        Exportar
                    </button>
                    <button onClick={() => canDelete && onDelete(template.id)}
                        disabled={!canDelete}
                        className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40">
                        {canDelete ? 'Eliminar' : 'Protegido'}
                    </button>
                </div>
            </div>
        </div>
    );
}
```

### TemplateSection — resources/js/components/template-section.tsx

```tsx
import { Globe, LayoutDashboard, Lock, FileText } from 'lucide-react';
import type { TemplateCardData } from './template-card';
import TemplateCard from './template-card';

interface TemplateSectionProps {
    pageType: string;
    pageLabel: string;
    templates: TemplateCardData[];
    activeTemplateId: number | null;
    activeTemplateName: string | null;
    onActivate: (templateId: number) => void;
    onDeactivate: () => void;
    onDownload: (templateId: number) => void;
    onDelete: (templateId: number) => void;
}

const pageIcons: Record<string, React.ReactNode> = {
    landing: <Globe className="size-5" />,
    dashboard: <LayoutDashboard className="size-5" />,
    auth: <Lock className="size-5" />,
    forms: <FileText className="size-5" />,
};

export default function TemplateSection({
    pageType, pageLabel, templates, activeTemplateId,
    activeTemplateName, onActivate, onDeactivate,
    onDownload, onDelete,
}: TemplateSectionProps) {
    if (templates.length === 0) return null;

    return (
        <div className="rounded-xl border border-border p-6">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {pageIcons[pageType] ?? <Globe className="size-5" />}
                    </span>
                    <div>
                        <h2 className="text-lg font-semibold">{pageLabel}</h2>
                        <p className="text-xs text-muted-foreground">
                            {activeTemplateName ? `Activo: ${activeTemplateName}` : 'Sin template activo'}
                        </p>
                    </div>
                </div>
                {activeTemplateId && (
                    <button onClick={onDeactivate}
                        className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10">
                        Desactivar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((tmpl) => (
                    <TemplateCard
                        key={tmpl.id}
                        template={tmpl}
                        isActive={tmpl.id === activeTemplateId}
                        sectionPageType={pageType}
                        onActivate={() => onActivate(tmpl.id)}
                        onDeactivate={onDeactivate}
                        onDownload={onDownload}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}
```

---

## 11. Página principal: index.tsx con tabs

### resources/js/pages/admin/templates/index.tsx

```tsx
import { Head, router } from '@inertiajs/react';
import { FileText, Globe, LayoutDashboard, Lock, Plus, RefreshCw } from 'lucide-react';
import TemplateSection from '@/components/template-section';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import type { TemplateCardData } from '@/components/template-card';

const tabIcons: Record<string, React.ReactNode> = {
    landing: <Globe className="size-4" />,
    dashboard: <LayoutDashboard className="size-4" />,
    auth: <Lock className="size-4" />,
    forms: <FileText className="size-4" />,
};

interface IndexProps {
    templates: TemplateCardData[];
    activeTemplates: Record<string, { id: number; name: string }>;
    pageTypes: { value: string; label: string }[];
}

export default function Index({ templates, activeTemplates, pageTypes }: IndexProps) {
    const [activeTab, setActiveTab] = useState('landing');

    function handleActivate(templateId: number, pageType: string) {
        router.post(`/admin/templates/${templateId}/activate`, { page_type: pageType });
    }
    function handleDeactivate(pageType: string) {
        router.post('/admin/templates/deactivate', { page_type: pageType });
    }
    function handleDownload(templateId: number) {
        window.open(`/admin/templates/${templateId}/download`, '_blank');
    }
    function handleDelete(templateId: number) {
        if (confirm('¿Estás seguro de eliminar este template?')) {
            router.delete(`/admin/templates/${templateId}`);
        }
    }

    const sections = useMemo(() =>
        pageTypes.map((pt) => {
            const compatible = templates.filter((t) => t.allowed_page_types.includes(pt.value));
            const active = activeTemplates[pt.value];
            return { ...pt, templates: compatible, activeTemplateId: active?.id ?? null, activeTemplateName: active?.name ?? null };
        }), [templates, activeTemplates, pageTypes]);

    const activeSection = sections.find((s) => s.value === activeTab);
    const hasTemplates = templates.length > 0;

    return (
        <>
            <Head title="Gestión de Templates" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
                        <p className="text-sm text-muted-foreground">Gestiona las plantillas de layout del sistema</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.reload()}>
                            <RefreshCw className="mr-1 size-4" /> Recargar
                        </Button>
                        <Button size="sm" onClick={() => router.visit('/admin/templates/upload')}>
                            <Plus className="mr-1 size-4" /> Subir Template
                        </Button>
                    </div>
                </div>

                {!hasTemplates ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
                        <p className="text-lg font-medium text-muted-foreground">No hay templates instalados</p>
                        <p className="mt-1 text-sm text-muted-foreground/60">Sube tu primer template para comenzar</p>
                        <Button className="mt-4" onClick={() => router.visit('/admin/templates/upload')}>
                            <Plus className="mr-1 size-4" /> Subir Template
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <nav className="flex gap-1 border-b border-border">
                            {sections.map((section) => (
                                <button key={section.value}
                                    onClick={() => setActiveTab(section.value)}
                                    className={cn(
                                        'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                                        activeTab === section.value
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground',
                                    )}>
                                    {tabIcons[section.value]}
                                    {section.label}
                                </button>
                            ))}
                        </nav>

                        {activeSection && (
                            <TemplateSection
                                key={activeSection.value}
                                pageType={activeSection.value}
                                pageLabel={activeSection.label}
                                templates={activeSection.templates}
                                activeTemplateId={activeSection.activeTemplateId}
                                activeTemplateName={activeSection.activeTemplateName}
                                onActivate={(templateId) => handleActivate(templateId, activeSection.value)}
                                onDeactivate={() => handleDeactivate(activeSection.value)}
                                onDownload={handleDownload}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
```

---

## 12. Template Uploader (Drag & Drop)

### resources/js/components/template-uploader.tsx

```tsx
import { Upload, X, FileArchive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback, useRef, useState } from 'react';

interface TemplateUploaderProps {
    onUpload: (file: File) => void;
    isProcessing: boolean;
}

export default function TemplateUploader({ onUpload, isProcessing }: TemplateUploaderProps) {
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        if (!file.name.endsWith('.zip')) {
            alert('Solo se permiten archivos ZIP.');
            return;
        }
        setSelectedFile(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    return (
        <div className="space-y-4">
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
                    dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                )}
            >
                <input ref={inputRef} type="file" accept=".zip" className="hidden" onChange={handleInput} />
                <Upload className="mb-2 size-8 text-muted-foreground/60" />
                <p className="text-sm font-medium">Arrastra tu ZIP aquí o haz clic para seleccionar</p>
                <p className="text-xs text-muted-foreground mt-1">Solo archivos ZIP (máx. 10MB)</p>
            </div>

            {selectedFile && (
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                        <FileArchive className="size-5 text-primary" />
                        <div>
                            <p className="text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onUpload(selectedFile)}
                            disabled={isProcessing}
                            className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isProcessing ? 'Instalando...' : 'Instalar'}
                        </button>
                        <button onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-foreground">
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
```

---

## 13. Seeders

### database/seeders/TemplateSeeder.php

```php
<?php

namespace Database\Seeders;

use App\Models\LayoutTemplate;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Landing Page',
                'slug' => 'landing',
                'type' => 'landing',
                'version' => '1.0.0',
                'author' => 'AutoReserve',
                'description' => 'Plantilla moderna para landing page.',
                'is_protected' => true,
            ],
            [
                'name' => 'Dashboard',
                'slug' => 'dashboard',
                'type' => 'dashboard',
                'version' => '1.0.0',
                'author' => 'AutoReserve',
                'description' => 'Panel de administración con sidebar y navegación.',
                'is_protected' => true,
            ],
            [
                'name' => 'Full Template',
                'slug' => 'full',
                'type' => 'full',
                'version' => '1.0.0',
                'author' => 'AutoReserve',
                'description' => 'Template universal que funciona en cualquier tipo de página.',
                'is_protected' => true,
            ],
            [
                'name' => 'Autenticación',
                'slug' => 'auth',
                'type' => 'auth',
                'version' => '1.0.0',
                'author' => 'AutoReserve',
                'description' => 'Plantilla base para páginas de autenticación.',
                'is_protected' => true,
            ],
            [
                'name' => 'Formularios',
                'slug' => 'forms',
                'type' => 'forms',
                'version' => '1.0.0',
                'author' => 'AutoReserve',
                'description' => 'Plantilla base para páginas con formularios.',
                'is_protected' => true,
            ],
        ];

        foreach ($templates as $tmpl) {
            if (!LayoutTemplate::where('slug', $tmpl['slug'])->exists()) {
                LayoutTemplate::create($tmpl);
            }
        }
    }
}
```

### database/seeders/UserSeeder.php (opcional)

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Admin', 'email' => 'admin@autoreserve.com'],
            ['name' => 'Gerente', 'email' => 'gerente@autoreserve.com'],
            ['name' => 'Empleado', 'email' => 'empleado@autoreserve.com'],
            ['name' => 'Test User', 'email' => 'test@autoreserve.com'],
        ];

        foreach ($users as $data) {
            if (!User::where('email', $data['email'])->exists()) {
                User::create([
                    ...$data,
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ]);
            }
        }
    }
}
```

---

## 14. Ejemplo de ZIP para subir

### Estructura del ZIP

```
aurora.zip
└── aurora/                          # Carpeta raíz (nombre = slug)
    ├── aurora.json                  # Manifiesto
    ├── aurora-template.tsx          # Entry point
    ├── aurora-layout.tsx            # Layout principal
    ├── aurora-header.tsx            # Componentes opcionales
    ├── aurora-footer.tsx
    └── thumbnails/
        └── preview.png              # Screenshot (opcional)
```

### aurora.json

```json
{
    "name": "Aurora",
    "slug": "aurora",
    "type": "full",
    "version": "1.0.0",
    "author": "Tu Nombre",
    "description": "Template Aurora — diseño moderno y responsivo",
    "components": {
        "layout": "aurora-layout.tsx",
        "header": "aurora-header.tsx",
        "footer": "aurora-footer.tsx"
    }
}
```

### aurora-template.tsx — Entry point

```tsx
import AuroraLayout from '@/layouts/aurora/aurora-layout';

interface AuroraTemplateProps {
    breadcrumbs?: { label: string; href?: string }[];
    children: React.ReactNode;
}

export default function AuroraTemplate({ children }: AuroraTemplateProps) {
    return <AuroraLayout>{children}</AuroraLayout>;
}
```

El entry point SIEMPRE debe:
- Nombre: `{slug}-template.tsx`
- Importar el layout desde `@/layouts/{slug}/{slug}-layout`
- Exportar un default component que recibe `{ breadcrumbs?, children }`
- Renderizar el layout con `{children}`

### aurora-layout.tsx

```tsx
export default function AuroraLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b px-6 py-4">
                <h1 className="text-xl font-bold">Aurora</h1>
            </header>
            <main className="flex-1 p-6">{children}</main>
            <footer className="border-t px-6 py-3 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Aurora Template
            </footer>
        </div>
    );
}
```

---

## 15. Reglas de tipo (type)

| type | Sección | Aparece en |
|---|---|---|
| `landing` | Landing Page | Solo landing |
| `dashboard` | Dashboard | Solo dashboard |
| `auth` | Autenticación | Solo auth |
| `forms` | Formularios | Solo forms |
| `full` | Todas | landing, dashboard, auth, forms |

---

## 16. Flujo completo

```
1. Admin entra a /admin/templates
2. Ve tabs: Landing, Dashboard, Auth, Forms
3. Cada tab muestra templates compatibles + activo actual
4. Sube ZIP → se extrae a resources/js/layouts/{slug}/
5. Template aparece en la lista, disponible para activar
6. Click "Activar" → solo DB (LayoutAssignment), sin copiar archivos
7. Frontend recarga → app-layout.tsx lee activeTemplates de shared props
8. import.meta.glob encuentra el template en layouts/{slug}/{slug}-template.tsx
9. React.lazy() lo carga → se renderiza como layout de la página
10. Click "Desactivar" → borra LayoutAssignment, vuelve al layout default
11. Click "Eliminar" → borra carpeta layouts/{slug}/ + registro DB (solo si no es protegido)
```

---

## 17. Tipos TypeScript

### resources/js/types/template.ts

```ts
export interface LayoutTemplate {
    id: number;
    name: string;
    slug: string;
    type: string;
    type_label: string;
    version: string;
    author: string;
    description: string | null;
    thumbnail: string | null;
    is_protected: boolean;
    is_active: boolean;
    assigned_to: string[];
    allowed_page_types: string[];
    created_at: string;
}

export interface PageTypeOption {
    value: string;
    label: string;
}
```

### resources/js/types/global.d.ts (agregar activeTemplates)

```ts
declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            activeTemplates: Record<string, LayoutTemplate>;
            [key: string]: unknown;
        };
    }
}
```

---

## 18. Comando Artisan: template:build-zip

### app/Console/Commands/BuildTemplateZip.php

```php
<?php

namespace App\Console\Commands;

use App\Models\LayoutTemplate;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class BuildTemplateZip extends Command
{
    protected $signature = 'template:build-zip {slug? : Slug del template a empaquetar}';

    protected $description = 'Genera archivos ZIP para los templates instalados';

    public function handle(): void
    {
        $templates = $this->argument('slug')
            ? LayoutTemplate::where('slug', $this->argument('slug'))->get()
            : LayoutTemplate::all();

        $outputDir = storage_path('app/templates/samples');
        File::ensureDirectoryExists($outputDir);

        foreach ($templates as $template) {
            $sourceDir = resource_path("js/layouts/{$template->slug}");

            if (!File::exists($sourceDir)) {
                $defaultDir = resource_path("js/layouts/default/{$template->slug}");
                if (File::exists($defaultDir)) {
                    $sourceDir = $defaultDir;
                } else {
                    $this->warn("Directorio para '{$template->slug}' no existe.");
                    continue;
                }
            }

            $zipPath = "{$outputDir}/{$template->slug}.zip";
            $zip = new \ZipArchive;
            if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
                $this->error("No se pudo crear ZIP para '{$template->slug}'.");
                continue;
            }

            foreach (File::allFiles($sourceDir) as $file) {
                $zip->addFile($file->getRealPath(), "{$template->slug}/" . $file->getRelativePathname());
            }

            $zip->close();
            $this->info("✓ ZIP: {$zipPath}");
        }
    }
}
```

Registrar en `routes/console.php` o no es necesario si se usa `php artisan app:build TemplateBuildZipCommand`.

---

## 19. Resumen de archivos necesarios

### Backend
```
app/Models/LayoutTemplate.php
app/Models/LayoutAssignment.php
app/Services/TemplateManager.php
app/Http/Controllers/Admin/TemplateController.php
app/Http/Requests/Admin/StoreTemplateRequest.php
app/Console/Commands/BuildTemplateZip.php
database/migrations/XXXX_XX_XX_create_layout_templates_table.php
database/migrations/XXXX_XX_XX_create_layout_assignments_table.php
database/seeders/TemplateSeeder.php
routes/admin.php
```

### Frontend
```
resources/js/lib/template-resolver.ts
resources/js/components/template-card.tsx
resources/js/components/template-section.tsx
resources/js/components/template-uploader.tsx
resources/js/pages/admin/templates/index.tsx
resources/js/pages/admin/templates/upload.tsx
resources/js/types/template.ts
resources/js/types/global.d.ts (modificar)
resources/js/layouts/app-layout.tsx (modificar)
resources/js/layouts/auth-layout.tsx (modificar)
```

### Layouts base
```
resources/js/layouts/default/landing/
resources/js/layouts/default/dashboard/
resources/js/layouts/default/full/
resources/js/layouts/default/auth/
resources/js/layouts/default/forms/
```

### Estructura de cada template base
```
{slug}/
├── {slug}-template.tsx   # Entry point
├── {slug}-layout.tsx     # Layout principal
├── {slug}.json           # Manifiesto
├── {slug}-header.tsx     # Componentes opcionales
├── {slug}-footer.tsx
└── thumbnails/preview.png
```