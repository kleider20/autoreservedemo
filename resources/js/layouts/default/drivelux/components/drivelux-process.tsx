import { processSteps } from '@/layouts/default/drivelux/data/drivelux-data';

export default function DriveluxProcess() {
    return (
        <section id="proceso" className="py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#fbbf24' }}>Cómo funciona</span>
                    <h2 className="font-serif mt-3 text-4xl font-bold md:text-5xl text-heading">
                        Reserva en <span className="gradient-text">4 pasos</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted">
                        Un proceso completamente digital, seguro y automatizado. Desde la selección hasta la firma del contrato.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-4">
                    {processSteps.map((step) => (
                        <div key={step.n} className="card card-hover relative rounded-2xl p-8">
                            <div className="btn-primary absolute -left-4 -top-4 flex size-10 items-center justify-center rounded-full font-bold text-white">
                                {step.n}
                            </div>
                            <div className="mb-6 flex size-14 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))' }}>
                                <svg className="size-7" style={{ color: '#60a5fa' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                                </svg>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-heading">{step.t}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted">{step.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}