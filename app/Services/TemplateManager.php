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

        // The ZIP must contain a single root folder matching the slug
        $entries = [];
        for ($i = 0; $i < $zip->count(); $i++) {
            $stat = $zip->statIndex($i);
            $entries[] = $stat['name'];
        }

        $rootFolder = null;
        foreach ($entries as $entry) {
            if (str_contains($entry, '/') && ! str_starts_with($entry, '__MACOSX')) {
                $parts = explode('/', $entry);
                $rootFolder = $parts[0];
                break;
            }
        }

        if (! $rootFolder) {
            throw new RuntimeException('El ZIP debe contener una carpeta raíz con el nombre del template.');
        }

        // Find manifest: {rootFolder}.json or template.json
        $manifestJson = $zip->getFromName("{$rootFolder}/{$rootFolder}.json")
            ?: $zip->getFromName("{$rootFolder}/template.json");

        if ($manifestJson === false) {
            $zip->close();
            throw new RuntimeException("El archivo ZIP no contiene un manifiesto '{$rootFolder}.json' válido.");
        }

        $manifest = json_decode($manifestJson, true);

        if (! isset($manifest['name'])) {
            $zip->close();
            throw new RuntimeException('El manifiesto debe contener al menos el campo "name".');
        }

        $slug = $manifest['slug'] ?? Str::slug($manifest['name']);

        if (LayoutTemplate::where('slug', $slug)->exists()) {
            $zip->close();
            throw new RuntimeException("Ya existe un template con el slug '{$slug}'.");
        }

        $type = $manifest['type'] ?? 'full';
        $this->validateType($type);

        $extractTo = "{$this->layoutsPath}/{$slug}";

        if (File::exists($extractTo)) {
            $zip->close();
            throw new RuntimeException("Ya existe una carpeta para el template '{$slug}'.");
        }

        // Extract only the contents of the root folder
        File::ensureDirectoryExists($extractTo);

        for ($i = 0; $i < $zip->count(); $i++) {
            $stat = $zip->statIndex($i);
            $name = $stat['name'];

            if (str_starts_with($name, '__MACOSX')) {
                continue;
            }

            if (str_starts_with($name, "{$rootFolder}/")) {
                $relativePath = substr($name, strlen($rootFolder) + 1);

                if (empty($relativePath)) {
                    continue;
                }

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

        if (! in_array($pageType, $allowedTypes)) {
            throw new RuntimeException(
                "El template '{$template->name}' es de tipo '{$template->type}' y solo puede asignarse a: "
                .implode(', ', $allowedTypes)
                .". No puede asignarse a '{$pageType}'."
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
            throw new RuntimeException(
                "El template '{$template->name}' es un template base del sistema y no puede eliminarse."
            );
        }

        $templateDir = "{$this->layoutsPath}/{$template->slug}";

        if (File::exists($templateDir)) {
            File::deleteDirectory($templateDir);
        }

        $storageThumbDir = storage_path("app/public/templates/{$template->slug}");
        if (File::exists($storageThumbDir)) {
            File::deleteDirectory($storageThumbDir);
        }

        $template->assignments()->delete();
        $template->delete();
    }

    public function getActiveTemplate(string $pageType): ?LayoutTemplate
    {
        $assignment = LayoutAssignment::where('page_type', $pageType)->first();

        return $assignment?->template;
    }

    public function getActiveTemplates(): array
    {
        $assignments = LayoutAssignment::with('template')->get();

        return $assignments->mapWithKeys(fn ($a) => [$a->page_type => $a->template])->toArray();
    }

    public function buildZipTemplate(string $slug): string
    {
        $sourceDir = "{$this->layoutsPath}/{$slug}";

        if (! File::exists($sourceDir)) {
            throw new RuntimeException("Template '{$slug}' no encontrado en layouts.");
        }

        $zipPath = storage_path("app/templates/{$slug}.zip");
        $zip = new ZipArchive;

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new RuntimeException('No se pudo crear el archivo ZIP.');
        }

        $files = File::allFiles($sourceDir);
        foreach ($files as $file) {
            $relativePath = "{$slug}/".$file->getRelativePathname();
            $zip->addFile($file->getRealPath(), $relativePath);
        }

        $zip->close();

        return $zipPath;
    }

    protected function validateStructure(string $extractTo, array $manifest, string $slug): void
    {
        $requiredFiles = ["{$slug}.json", "{$slug}-template.tsx"];
        $components = $manifest['components'] ?? [];

        foreach ($requiredFiles as $file) {
            if (! File::exists("{$extractTo}/{$file}")) {
                File::deleteDirectory($extractTo);
                throw new RuntimeException("Estructura inválida: falta el archivo '{$file}'.");
            }
        }

        if (! empty($components)) {
            foreach ($components as $key => $path) {
                $fullPath = "{$extractTo}/{$path}";
                if (! File::exists($fullPath)) {
                    File::deleteDirectory($extractTo);
                    throw new RuntimeException("Estructura inválida: componente '{$key}' no encontrado en '{$path}'.");
                }
            }
        }
    }

    protected function validateType(string $type): void
    {
        $validTypes = ['landing', 'dashboard', 'auth', 'forms', 'full'];

        if (! in_array($type, $validTypes)) {
            throw new RuntimeException(
                "Tipo de template inválido: '{$type}'. Los tipos válidos son: ".implode(', ', $validTypes)
            );
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
