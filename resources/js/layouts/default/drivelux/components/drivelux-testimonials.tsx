import { testimonialsData } from '@/layouts/default/drivelux/data/drivelux-data';

export default function DriveluxTestimonials() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#fbbf24' }}>Testimonios</span>
                    <h2 className="font-serif mt-3 text-4xl font-bold md:text-5xl text-heading">
                        Lo que dicen nuestros clientes
                    </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {testimonialsData.map((t) => (
                        <div key={t.n} className="card card-hover rounded-2xl p-8">
                            <div className="mb-4 flex gap-1" style={{ color: '#fbbf24' }}>★★★★★</div>
                            <p className="mb-6 leading-relaxed text-body">{t.t}</p>
                            <div className="flex items-center gap-3">
                                <div className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${t.g} font-bold text-white`}>
                                    {t.i}
                                </div>
                                <div>
                                    <div className="font-semibold text-heading">{t.n}</div>
                                    <div className="text-xs text-faint">{t.r}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}