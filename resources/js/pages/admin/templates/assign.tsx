import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import TemplateSelector from '@/components/template-selector';
import { Button } from '@/components/ui/button';

interface AssignProps {
    templates: {
        id: number;
        name: string;
        slug: string;
        type: string;
        type_label: string;
        is_protected: boolean;
        allowed_page_types: string[];
    }[];
    activeTemplates: Record<string, { id: number; name: string }>;
    pageTypes: { value: string; label: string }[];
}

export default function Assign({ templates, activeTemplates, pageTypes }: AssignProps) {
    function handleActivate(templateId: number, pageType: string) {
        router.post(`/admin/templates/${templateId}/activate`, { page_type: pageType });
    }

    function handleDeactivate(pageType: string) {
        router.post('/admin/templates/deactivate', { page_type: pageType });
    }

    return (
        <>
            <Head title="Asignar Templates" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.visit('/admin/templates')}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Asignar Templates</h1>
                        <p className="text-sm text-muted-foreground">
                            Selecciona qué template usar para cada tipo de página
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {pageTypes.map((pt) => (
                        <TemplateSelector
                            key={pt.value}
                            templates={templates}
                            activeTemplateId={activeTemplates[pt.value]?.id ?? null}
                            pageType={pt.value}
                            pageLabel={pt.label}
                            onActivate={handleActivate}
                            onDeactivate={handleDeactivate}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}