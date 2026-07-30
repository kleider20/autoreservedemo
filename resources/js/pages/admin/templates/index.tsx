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

    const sections = useMemo(
        () =>
            pageTypes.map((pt) => {
                const compatible = templates.filter((t) => t.allowed_page_types.includes(pt.value));
                const active = activeTemplates[pt.value];

                return {
                    ...pt,
                    templates: compatible,
                    activeTemplateId: active?.id ?? null,
                    activeTemplateName: active?.name ?? null,
                };
            }),
        [templates, activeTemplates, pageTypes],
    );

    const activeSection = sections.find((s) => s.value === activeTab);
    const hasTemplates = templates.length > 0;

    return (
        <>
            <Head title="Gestión de Templates" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona las plantillas de layout del sistema
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.reload()}>
                            <RefreshCw className="mr-1 size-4" />
                            Recargar
                        </Button>
                        <Button size="sm" onClick={() => router.visit('/admin/templates/upload')}>
                            <Plus className="mr-1 size-4" />
                            Subir Template
                        </Button>
                    </div>
                </div>

                {!hasTemplates ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
                        <p className="text-lg font-medium text-muted-foreground">
                            No hay templates instalados
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground/60">
                            Sube tu primer template para comenzar
                        </p>
                        <Button className="mt-4" onClick={() => router.visit('/admin/templates/upload')}>
                            <Plus className="mr-1 size-4" />
                            Subir Template
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <nav className="flex gap-1 border-b border-border">
                            {sections.map((section) => (
                                <button
                                    key={section.value}
                                    onClick={() => setActiveTab(section.value)}
                                    className={cn(
                                        'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                                        activeTab === section.value
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-muted-foreground hover:text-foreground',
                                    )}
                                >
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