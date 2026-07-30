import { Head, Link } from '@inertiajs/react';
import { Palette, Upload, Layers, ExternalLink } from 'lucide-react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link
                        href="/admin/templates"
                        className="group relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-primary/5 to-primary/10 transition-all hover:shadow-md dark:border-sidebar-border"
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                            <div className="rounded-full bg-primary/10 p-3 transition-transform group-hover:scale-110">
                                <Palette className="size-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">Gestionar Templates</h3>
                            <p className="text-xs text-muted-foreground">
                                Instala, activa y asigna plantillas de layout
                            </p>
                            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
                                Ir ahora <ExternalLink className="size-3" />
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/templates/upload"
                        className="group relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-accent/50 to-accent transition-all hover:shadow-md dark:border-sidebar-border"
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                            <div className="rounded-full bg-background/80 p-3 transition-transform group-hover:scale-110">
                                <Upload className="size-6 text-foreground" />
                            </div>
                            <h3 className="font-semibold">Subir Template</h3>
                            <p className="text-xs text-muted-foreground">
                                Agrega un nuevo layout desde un archivo ZIP
                            </p>
                            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                                Subir ahora <ExternalLink className="size-3" />
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/admin/templates"
                        className="group relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-muted to-muted/80 transition-all hover:shadow-md dark:border-sidebar-border"
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                            <div className="rounded-full bg-background/80 p-3 transition-transform group-hover:scale-110">
                                <Layers className="size-6 text-foreground" />
                            </div>
                            <h3 className="font-semibold">Gestionar Templates</h3>
                            <p className="text-xs text-muted-foreground">
                                Activa, sube o elimina layouts del sistema
                            </p>
                            <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                                Ir ahora <ExternalLink className="size-3" />
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
