const stats = [
  { n: '500+', l: 'Vehículos' },
  { n: '15K+', l: 'Clientes felices' },
  { n: '24/7', l: 'Soporte' },
  { n: '98%', l: 'Satisfacción' },
];

export default function DriveluxStats() {
    return (
        <section className="border-y py-12" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                    {stats.map((s) => (
                        <div key={s.l}>
                            <div className="font-serif text-4xl font-bold gradient-text">{s.n}</div>
                            <div className="mt-1 text-sm text-muted">{s.l}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}