import { usePage } from '@inertiajs/react';
import { Fullscreen, LayoutDashboard } from 'lucide-react';

interface FullLayoutProps {
    breadcrumbs?: { label: string; href?: string }[];
    children: React.ReactNode;
}

export default function FullLayout({ children }: FullLayoutProps) {
    const { url } = usePage();
    const isLanding = url === '/' || url.startsWith('/#');

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted">
            <header className="border-b border-primary/20 bg-primary/5 px-6 py-3">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isLanding ? (
                            <Fullscreen className="size-5 text-primary" />
                        ) : (
                            <LayoutDashboard className="size-5 text-primary" />
                        )}
                        <span className="text-lg font-semibold tracking-tight">
                            AutoReserve <span className="text-primary">✦</span>
                        </span>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Full Template
                    </span>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-primary/10 bg-primary/5 px-6 py-4 text-center text-xs text-muted-foreground">
                <div className="mx-auto max-w-7xl">
                    Full Template — Funciona en cualquier tipo de página ({isLanding ? 'Landing' : 'Dashboard'})
                    &copy; {new Date().getFullYear()} AutoReserve
                </div>
            </footer>
        </div>
    );
}