import { vehiclesData } from '@/layouts/default/drivelux/data/drivelux-data';

export default function DriveluxHero() {
    return (
        <section className="relative grid-bg overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
            <div className="blob -left-20 -top-20" style={{ width: 384, height: 384, backgroundColor: '#2563eb' }} />
            <div className="blob right-0 top-40" style={{ width: 384, height: 384, backgroundColor: '#f59e0b' }} />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-12 md:grid-cols-2">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium hero-badge text-heading" style={{ borderColor: 'rgba(59,130,246,0.3)' }}>
                            <span className="size-2 animate-pulse rounded-full" style={{ backgroundColor: '#fbbf24' }} />
                            RESERVAS EN TIEMPO REAL · FIRMA DIGITAL
                        </div>

                        <h1 className="font-serif text-5xl font-bold leading-tight md:text-6xl lg:text-7xl text-heading">
                            Conduce el <span className="gradient-text">auto de tus sueños</span> hoy
                        </h1>

                        <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted">
                            Renta vehículos premium con disponibilidad en tiempo real, pagos seguros y firma digital de contratos. Todo el proceso en minutos, sin filas ni papeleo.
                        </p>

                        <div className="mb-10 flex flex-col gap-4 sm:flex-row">
                            <a href="#reservar" className="pulse-btn btn-primary rounded-full px-8 py-4 text-center font-bold transition hover:scale-105">
                                Reservar vehículo
                            </a>
                            <a href="#flota" className="rounded-full border px-8 py-4 text-center font-medium transition hover:border-amber-400 hover:text-amber-400" style={{ borderColor: 'rgba(59,130,246,0.3)' }}>
                                Ver flota
                            </a>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
                            {[
                                { label: '+500 vehículos' },
                                { label: 'Cancelación gratuita' },
                                { label: 'Soporte 24/7' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <svg className="size-5" style={{ color: '#10b981' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 blur-3xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(251,191,36,0.2))' }} />
                        <img
                            src={vehiclesData[0].image}
                            alt="SUV Premium"
                            className="relative w-full rounded-2xl"
                            style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}