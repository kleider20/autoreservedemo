export default function DriveluxCta() {
    return (
        <section className="relative overflow-hidden py-20">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.2), rgba(251,191,36,0.1), rgba(59,130,246,0.2))' }} />
            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                <h2 className="font-serif text-4xl font-bold md:text-5xl text-heading">
                    ¿Listo para tu próximo viaje?
                </h2>
                <p className="mx-auto mt-6 mb-8 max-w-xl text-muted">
                    Únete a más de 15,000 clientes que ya disfrutan de la mejor experiencia de renta de vehículos.
                </p>
                <a href="#reservar" className="btn-primary inline-block rounded-full px-10 py-4 font-bold transition hover:scale-105">
                    Reservar ahora
                </a>
            </div>
        </section>
    );
}