import { Check, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateItem {
    id: number;
    name: string;
    slug: string;
    type: string;
    type_label: string;
    is_protected: boolean;
    allowed_page_types: string[];
}

interface TemplateSelectorProps {
    templates: TemplateItem[];
    activeTemplateId: number | null;
    pageType: string;
    pageLabel: string;
    onActivate: (templateId: number, pageType: string) => void;
    onDeactivate: (pageType: string) => void;
}

export default function TemplateSelector({
    templates,
    activeTemplateId,
    pageType,
    pageLabel,
    onActivate,
    onDeactivate,
}: TemplateSelectorProps) {
    const compatibleTemplates = templates.filter((t) =>
        t.allowed_page_types.includes(pageType),
    );

    return (
        <div className="space-y-3 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium">{pageLabel}</h3>
                    <p className="text-xs text-muted-foreground">
                        {compatibleTemplates.length === 0
                            ? 'No hay templates compatibles con este tipo de página'
                            : `${compatibleTemplates.length} template(s) compatible(s)`}
                    </p>
                </div>
                {activeTemplateId && (
                    <button
                        onClick={() => onDeactivate(pageType)}
                        className="text-xs text-destructive hover:underline"
                    >
                        Desactivar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {compatibleTemplates.map((tmpl) => {
                    const isActive = tmpl.id === activeTemplateId;
                    const isFull = tmpl.type === 'full';

return (
                        <button
                            key={tmpl.id}
                            onClick={() => onActivate(tmpl.id, pageType)}
                            className={cn(
                                'flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                                isActive
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border hover:border-muted-foreground/30 hover:bg-accent',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex size-5 shrink-0 items-center justify-center rounded-full border',
                                    isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-input',
                                )}
                            >
                                {isActive && <Check className="size-3" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{tmpl.name}</p>
                                <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                                    {tmpl.type_label}
                                    {tmpl.is_protected && <ShieldCheck className="size-3 text-amber-500" />}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {compatibleTemplates.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                    No hay templates compatibles. Los templates de tipo{' '}
                    <strong>&quot;{pageLabel}&quot;</strong> solo aceptan{' '}
                    <strong>{pageLabel}</strong> o <strong>Universal (Full)</strong>.
                </p>
            )}
        </div>
    );
}