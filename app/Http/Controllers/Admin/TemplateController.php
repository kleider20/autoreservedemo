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
        $templates = LayoutTemplate::with('assignments')->get()->map(fn ($t) => [
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

    public function destroy(LayoutTemplate $template): RedirectResponse
    {
        try {
            $this->templateManager->uninstall($template);

            return redirect()->route('admin.templates.index')
                ->with('flash', ['success' => "Template '{$template->name}' eliminado correctamente."]);
        } catch (\RuntimeException $e) {
            return redirect()->back()
                ->with('flash', ['error' => $e->getMessage()]);
        }
    }

    public function store(StoreTemplateRequest $request): RedirectResponse
    {
        try {
            $template = $this->templateManager->install($request->file('template'));

            return redirect()->route('admin.templates.index')
                ->with('flash', ['success' => "Template '{$template->name}' instalado correctamente."]);
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
            ->with('flash', ['success' => 'Template desactivado correctamente.']);
    }

    public function download(Request $request, LayoutTemplate $template): BinaryFileResponse
    {
        $zipPath = $this->templateManager->buildZipTemplate($template->slug);

        return response()->download($zipPath, "{$template->slug}.zip")->deleteFileAfterSend();
    }

    public function assign(): RedirectResponse
    {
        return redirect()->route('admin.templates.index');
    }

    public function upload(): Response
    {
        return Inertia::render('admin/templates/upload');
    }
}
