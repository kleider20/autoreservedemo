import { Link } from '@inertiajs/react';

const footerLinks = {
    Producto: [
        { label: 'Vehículos', href: '#vehiculos' },
        { label: 'Precios', href: '#precios' },
        { label: 'FAQ', href: '#faq' },
    ],
    Empresa: [
        { label: 'Sobre nosotros', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Contacto', href: '#contacto' },
    ],
    Legal: [
        { label: 'Términos', href: '#terminos' },
        { label: 'Privacidad', href: '#privacidad' },
    ],
};

export default function LandingFooter() {
    return (
        <footer className="border-t border-border bg-muted/50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="text-lg font-semibold tracking-tight">
                            AutoReserve
                        </Link>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sistema inteligente de reservas para tu negocio de alquiler.
                        </p>
                    </div>
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="mb-3 text-sm font-semibold">{category}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} AutoReserve. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}