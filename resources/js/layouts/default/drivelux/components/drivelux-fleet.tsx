import { useState } from 'react';
import { vehiclesData } from '@/layouts/default/drivelux/data/drivelux-data';

const filters = ['all', 'suv', 'sedan', 'deportivo', 'compacto'];

export default function DriveluxFleet({ onStartBooking }: { onStartBooking?: (id: number) => void }) {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? vehiclesData : vehiclesData.filter(v => v.category === filter);

    return (
        <section id="flota" className="relative py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#fbbf24' }}>Nuestra flota</span>
                    <h2 className="font-serif mt-3 text-4xl font-bold md:text-5xl text-heading">
                        Elige tu <span className="gradient-text">vehículo ideal</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-muted">
                        Desde compactos para la ciudad hasta SUVs premium. Todos nuestros vehículos están equipados con GPS, seguro completo y mantenimiento al día.
                    </p>
                </div>

                <div className="mb-12 flex flex-wrap justify-center gap-3">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                                filter === f
                                    ? 'text-white'
                                    : 'card border hover:border-blue-500'
                            }`}
                            style={filter === f ? { backgroundColor: '#3b82f6', color: 'white' } : {}}
                        >
                            {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {filtered.map(v => (
                        <div key={v.id} className="card card-hover overflow-hidden rounded-2xl">
                            <div className="relative h-48 overflow-hidden">
                                <img src={v.image} alt={v.name} className="size-full object-cover" />
                                <div className="badge absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize text-heading">
                                    {v.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-xl font-bold text-heading">{v.name}</h3>
                                <div className="mb-4 flex items-center gap-4 text-xs text-muted">
                                    <span>👥 {v.seats} asientos</span>
                                    <span>⚙ {v.transmission}</span>
                                    <span>⛽ {v.fuel}</span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-xs text-faint">Desde</div>
                                        <div className="font-serif text-2xl font-bold gradient-text">${v.price}</div>
                                        <div className="text-xs text-faint">por día</div>
                                    </div>
                                    <button
                                        onClick={() => onStartBooking ? onStartBooking(v.id) : (window.location.href = '#reservar')}
                                        className="btn-primary rounded-full px-4 py-2 text-sm font-semibold transition hover:scale-105"
                                    >
                                        Reservar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}