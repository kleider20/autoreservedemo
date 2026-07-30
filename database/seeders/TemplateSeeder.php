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
                'description' => 'Plantilla moderna para landing page. Solo aplica a páginas de tipo landing.',
                'is_protected' => true,
            ],
            [
                'name' => 'Dashboard',
                'slug' => 'dashboard',
                'type' => 'dashboard',
                'version' => '1.0.0',
                'author' => 'AutoReserve',
                'description' => 'Panel de administración con sidebar y navegación. Solo aplica a dashboard.',
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
            if (LayoutTemplate::where('slug', $tmpl['slug'])->exists()) {
                $this->command->warn("Template '{$tmpl['slug']}' ya existe, saltando.");

                continue;
            }

            LayoutTemplate::create($tmpl);

            $this->command->info("Template '{$tmpl['name']}' registrado (type: {$tmpl['type']}, protegido: sí).");
        }
    }
}
