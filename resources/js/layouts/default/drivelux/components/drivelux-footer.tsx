export default function DriveluxFooter() {
    return (
        <footer className="border-t py-12" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-8 grid gap-8 md:grid-cols-4">
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-amber-400">
                                <svg className="size-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <span className="font-serif text-2xl font-bold text-heading">
                                Drive<span style={{ color: '#fbbf24' }}>Lux</span>
                            </span>
                        </div>
                        <p className="text-sm text-faint">La plataforma líder en renta de vehículos premium con tecnología de punta y atención personalizada.</p>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-heading">Servicios</h4>
                        <ul className="space-y-2 text-sm text-faint">
                            <li><a href="#flota" className="transition hover:text-amber-400">Renta de vehículos</a></li>
                            <li><a href="#" className="transition hover:text-amber-400">Renta corporativa</a></li>
                            <li><a href="#" className="transition hover:text-amber-400">Traslados al aeropuerto</a></li>
                            <li><a href="#" className="transition hover:text-amber-400">Eventos especiales</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-heading">Empresa</h4>
                        <ul className="space-y-2 text-sm text-faint">
                            <li><a href="#" className="transition hover:text-amber-400">Sobre nosotros</a></li>
                            <li><a href="#" className="transition hover:text-amber-400">Sucursales</a></li>
                            <li><a href="#" className="transition hover:text-amber-400">Blog</a></li>
                            <li><a href="#" className="transition hover:text-amber-400">Contacto</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-heading">Legal</h4>
                        <ul className="space-y-2 text-sm text-faint">
                            <li><a href="#" className="transition hover:text-amber-400">Términos y condiciones</a></li>
                            <li><a href="#" className="transition hover:text-amber-400">Política de privacidad</a></li>
                            <li><a href="#" className="transition hover:text-amber-400">Política de cancelación</a></li>
                            <li><a href="#" className="transition hover:text-amber-400">Aviso legal</a></li>
                        </ul>
                    </div>
                </div>
                <div className="divider mb-6" />
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-faint md:flex-row">
                    <div>© 2026 DriveLux. Todos los derechos reservados.</div>
                    <div className="flex items-center gap-2">
                        <span>Creado por Kleider Rosamilia</span>
                        <a href="https://github.com/kleider20" target="_blank" rel="noopener noreferrer" className="transition hover:text-amber-400">
                            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}