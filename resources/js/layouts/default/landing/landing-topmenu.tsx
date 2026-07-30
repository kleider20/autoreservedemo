import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Vehículos', href: '#vehiculos' },
    { label: 'Cómo funciona', href: '#como-funciona' },
    { label: 'Contacto', href: '#contacto' },
];

export default function LandingTopmenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="text-xl font-semibold tracking-tight">
                    AutoReserve
                </Link>

                <div className="hidden items-center gap-6 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className="ml-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                        Iniciar Sesión
                    </Link>
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-md p-2 text-muted-foreground md:hidden"
                >
                    {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {isOpen && (
                <div className="border-t border-border px-4 pb-4 md:hidden">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className="mt-2 block rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                        onClick={() => setIsOpen(false)}
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            )}
        </nav>
    );
}