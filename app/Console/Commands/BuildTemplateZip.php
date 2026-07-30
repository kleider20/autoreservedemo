<?php

namespace App\Console\Commands;

use App\Models\LayoutTemplate;
use App\Services\TemplateManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class BuildTemplateZip extends Command
{
    protected $signature = 'template:build-zip {slug? : Slug del template a empaquetar (opcional, si se omite se empaquetan todos)}';

    protected $description = 'Genera archivos ZIP de ejemplo para los templates instalados';

    public function handle(TemplateManager $templateManager): void
    {
        if ($slug = $this->argument('slug')) {
            $templates = LayoutTemplate::where('slug', $slug)->get();

            if ($templates->isEmpty()) {
                $this->error("No se encontró el template con slug '{$slug}'.");

                return;
            }
        } else {
            $templates = LayoutTemplate::all();
        }

        $outputDir = storage_path('app/templates/samples');
        File::ensureDirectoryExists($outputDir);

        foreach ($templates as $template) {
            $sourceDir = resource_path("js/layouts/{$template->slug}");

            if (! File::exists($sourceDir)) {
                // Try default/ subfolder for base templates
                $defaultDir = resource_path("js/layouts/default/{$template->slug}");
                if (File::exists($defaultDir)) {
                    $sourceDir = $defaultDir;
                } else {
                    $this->warn("El directorio de origen para '{$template->slug}' no existe.");

                    continue;
                }
            }

            $zipPath = "{$outputDir}/{$template->slug}.zip";
            $zip = new \ZipArchive;

            if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
                $this->error("No se pudo crear el ZIP para '{$template->slug}'.");

                continue;
            }

            $files = File::allFiles($sourceDir);
            foreach ($files as $file) {
                $relativePath = "{$template->slug}/".$file->getRelativePathname();
                $zip->addFile($file->getRealPath(), $relativePath);
            }

            $zip->close();

            $this->info("✓ ZIP generado: {$zipPath} (".number_format(filesize($zipPath) / 1024, 1).' KB)');
        }

        $this->newLine();
        $this->info("ZIPs disponibles en: {$outputDir}");
    }
}
