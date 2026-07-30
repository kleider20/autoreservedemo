import { ArrowRight, Car, Shield, Clock } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function LandingHeader() {
    return (
        <header className="relative pt-16">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Reserva tu vehículo
                        <span className="text-primary"> de forma fácil y rápida</span>
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground">
                        El mejor sistema de reservas para tu negocio de alquiler de vehículos.
                        Gestiona disponibilidad, precios y reservas en un solo lugar.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            Comenzar ahora
                            <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href="#como-funciona"
                            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
                        >
                            Ver demo
                        </Link>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {[
                        { icon: Car, title: 'Amplia flota', desc: 'Vehículos para toda ocasión' },
                        { icon: Shield, title: 'Seguro incluido', desc: 'Protección completa en cada reserva' },
                        { icon: Clock, title: 'Reserva 24/7', desc: 'Disponible cuando nos necesites' },
                    ].map((item) => (
                        <div key={item.title} className="rounded-xl border border-border p-6 text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary/10">
                                <item.icon className="size-6 text-primary" />
                            </div>
                            <h3 className="mt-4 font-semibold">{item.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
}