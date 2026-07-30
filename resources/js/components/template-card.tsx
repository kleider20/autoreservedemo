import { Layers, Palette, ShieldCheck, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TemplateCardData {
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

interface TemplateCardProps {
    template: TemplateCardData;
    isActive?: boolean;
    sectionPageType?: string;
    onActivate?: () => void;
    onDeactivate?: () => void;
    onDownload: (templateId: number) => void;
    onDelete: (templateId: number) => void;
}

const typeLabels: Record<string, string> = {
    landing: 'Landing Page',
    dashboard: 'Dashboard',
    auth: 'Autenticación',
    forms: 'Formularios',
    full: 'Full',
};

const typeColors: Record<string, string> = {
    landing: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    dashboard: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    auth: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    forms: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    full: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
};

export default function TemplateCard({
    template,
    isActive = false,
    sectionPageType,
    onActivate,
    onDeactivate,
    onDownload,
    onDelete,
}: TemplateCardProps) {
    const canDelete = !template.is_protected;

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-xl border transition-all hover:shadow-md',
                isActive ? 'border-primary bg-primary/5' : 'border-border bg-card',
            )}
        >
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
                        <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium', typeColors[template.type] ?? 'bg-primary/10 text-primary')}>
                            {template.type_label}
                        </span>

                        {template.is_protected && (
                            <span
                                className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                title="Template base del sistema — no se puede eliminar"
                            >
                                <ShieldCheck className="size-3" />
                                Default
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
                            <span
                                key={pt}
                                className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', typeColors[pt])}
                            >
                                {typeLabels[pt] ?? pt}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                    {sectionPageType && onActivate && (
                        isActive ? (
                            <button
                                onClick={onDeactivate}
                                className="flex items-center gap-1 rounded-md border border-destructive/30 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                            >
                                Desactivar
                            </button>
                        ) : (
                            <button
                                onClick={onActivate}
                                className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90"
                            >
                                <Check className="size-3" />
                                Activar
                            </button>
                        )
                    )}

                    <button
                        onClick={() => onDownload(template.id)}
                        className="rounded-md border border-input px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
                    >
                        Exportar
                    </button>

                    <button
                        onClick={() => canDelete && onDelete(template.id)}
                        disabled={!canDelete}
                        title={canDelete ? '' : 'Template base del sistema — no se puede eliminar'}
                        className="rounded-md border border-destructive/30 px-3 py-1.5 text-xs text-destructive transition-opacity hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {canDelete ? 'Eliminar' : 'Protegido'}
                    </button>
                </div>
            </div>
        </div>
    );
}