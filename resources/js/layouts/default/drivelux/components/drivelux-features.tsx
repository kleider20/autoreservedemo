import { featuresData } from '@/layouts/default/drivelux/data/drivelux-data';

export default function DriveluxFeatures() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#fbbf24' }}>Por qué DriveLux</span>
                    <h2 className="font-serif mt-3 text-4xl font-bold md:text-5xl text-heading">
                        La mejor experiencia de <span className="gradient-text">renta</span>
                    </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {featuresData.map((f) => (
                        <div key={f.t} className="card card-hover rounded-2xl p-8">
                            <div className={`mb-6 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br ${f.color}`}>
                                <svg className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                                </svg>
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-heading">{f.t}</h3>
                            <p className="mt-3 leading-relaxed text-muted">{f.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}