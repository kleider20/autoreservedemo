import { useAppearance } from '@/hooks/use-appearance';

export default function DriveluxNavbar() {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const isDark = resolvedAppearance === 'dark';

    return (
        <nav className="glass-nav fixed left-0 right-0 top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <a href="#" className="flex items-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-amber-400">
                        <svg className="size-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </div>
                    <span className="font-serif text-2xl font-bold text-heading">
                        Drive<span style={{ color: '#fbbf24' }}>Lux</span>
                    </span>
                </a>
                <div className="hidden items-center gap-8 text-sm md:flex">
                    <a href="#flota" className="text-muted transition hover:text-amber-400">Flota</a>
                    <a href="#reservar" className="text-muted transition hover:text-amber-400">Reservar</a>
                    <a href="#proceso" className="text-muted transition hover:text-amber-400">Proceso</a>
                    <a href="#faq" className="text-muted transition hover:text-amber-400">FAQ</a>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema" title="Cambiar tema">
                        <div className="theme-toggle-knob">
                            <svg style={{ display: isDark ? 'block' : 'none' }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                            </svg>
                            <svg style={{ display: isDark ? 'none' : 'block' }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </button>
                    <a href="#reservar" className="btn-primary hidden rounded-full px-5 py-2.5 text-sm font-semibold transition hover:scale-105 sm:inline-block">
                        Reservar ahora
                    </a>
                </div>
            </div>
        </nav>
    );
}