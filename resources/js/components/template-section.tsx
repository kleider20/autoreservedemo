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
    pageType,
    pageLabel,
    templates,
    activeTemplateId,
    activeTemplateName,
    onActivate,
    onDeactivate,
    onDownload,
    onDelete,
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
                            {activeTemplateName
                                ? `Activo: ${activeTemplateName}`
                                : 'Sin template activo'}
                        </p>
                    </div>
                </div>
                {activeTemplateId && (
                    <button
                        onClick={onDeactivate}
                        className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                    >
                        Desactivar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((tmpl) => {
                    const isActive = tmpl.id === activeTemplateId;

                    return (
                        <TemplateCard
                            key={tmpl.id}
                            template={tmpl}
                            isActive={isActive}
                            sectionPageType={pageType}
                            onActivate={() => onActivate(tmpl.id)}
                            onDeactivate={onDeactivate}
                            onDownload={onDownload}
                            onDelete={onDelete}
                        />
                    );
                })}
            </div>
        </div>
    );
}