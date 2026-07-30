import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { vehiclesData, today, formatDateStr, generateBookedDates, MONTH_NAMES } from '@/layouts/default/drivelux/data/drivelux-data';

type Step = 1 | 2 | 3 | 4 | 'success';

export default function DriveluxBooking() {
    const [step, setStep] = useState<Step>(1);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [calendarDate, setCalendarDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [cardNumber, setCardNumber] = useState('');
    const [clientName, setClientName] = useState('');
    const [signatureStatus, setSignatureStatus] = useState('Sin firma');
    const [bookingNum, setBookingNum] = useState('');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const signatureCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const signatureDrawingRef = useRef(false);

    const bookedDates = useMemo(() => generateBookedDates(), []);
    const selectedVehicle = vehiclesData.find(v => v.id === selectedVehicleId);

    const minDate = selectedDates.length > 0 ? selectedDates[0] : null;
    const maxDate = selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null;

    const totalDays = selectedDates.length;

    const totalPrice = selectedVehicle && totalDays > 0 ? selectedVehicle.price * totalDays : 0;
    const subtotal = totalPrice;
    const insurance = Math.round(subtotal * 0.15);
    const tax = Math.round((subtotal + insurance) * 0.16);
    const grandTotal = subtotal + insurance + tax;

    const isDateBooked = (dateStr: string) => selectedVehicleId ? (bookedDates[selectedVehicleId] || []).includes(dateStr) : false;

    const toggleDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (date < todayStart || isDateBooked(dateStr)) return;

        setSelectedDates(prev => {
            const exists = prev.includes(dateStr);
            if (exists) return prev.filter(d => d !== dateStr).sort();

            const allDates = [...prev, dateStr].sort();
            if (allDates.length < 2) return allDates;

            const min = new Date(allDates[0]);
            const max = new Date(allDates[allDates.length - 1]);
            const filled: string[] = [];
            const cur = new Date(min);
            while (cur <= max) {
                filled.push(formatDateStr(cur));
                cur.setDate(cur.getDate() + 1);
            }
            return filled;
        });
    };

    const formatCardInput = (value: string) => {
        const v = value.replace(/\D/g, '').substring(0, 16);
        return v.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiryInput = (value: string) => {
        let v = value.replace(/\D/g, '').substring(0, 4);
        if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
        return v;
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(calendarDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCalendarDate(newDate);
    };

    const initSignaturePad = () => {
        setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * 2;
            canvas.height = rect.height * 2;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.scale(2, 2);
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            signatureCtxRef.current = ctx;

            const getPos = (e: MouseEvent | TouchEvent) => {
                const r = canvas.getBoundingClientRect();
                const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
                const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
                return { x: clientX - r.left, y: clientY - r.top };
            };

            const start = (e: MouseEvent | TouchEvent) => {
                e.preventDefault();
                signatureDrawingRef.current = true;
                const { x, y } = getPos(e);
                ctx.beginPath();
                ctx.moveTo(x, y);
            };
            const draw = (e: MouseEvent | TouchEvent) => {
                e.preventDefault();
                if (!signatureDrawingRef.current) return;
                const { x, y } = getPos(e);
                ctx.lineTo(x, y);
                ctx.stroke();
                setSignatureStatus('Firma registrada ✓');
            };
            const end = () => { signatureDrawingRef.current = false; };

            canvas.onmousedown = start;
            canvas.onmousemove = draw;
            canvas.onmouseup = end;
            canvas.onmouseleave = end;
            canvas.ontouchstart = start;
            canvas.ontouchmove = draw;
            canvas.ontouchend = end;
        }, 100);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas || !signatureCtxRef.current) return;
        signatureCtxRef.current.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureStatus('Sin firma');
    };

    useEffect(() => {
        if (step === 4) initSignaturePad();
    }, [step]);

    const completeBooking = () => {
        if (!clientName.trim()) return;
        setBookingNum('DL-' + Date.now().toString().slice(-8));
        setStep('success');
    };

    const resetBooking = () => {
        setStep(1);
        setSelectedVehicleId(null);
        setSelectedDates([]);
        setCardNumber('');
        setClientName('');
        setSignatureStatus('Sin firma');
        setBookingNum('');
        clearSignature();
    };

    const renderCalendarCells = () => {
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = (firstDay.getDay() + 6) % 7;
        const todayStr = formatDateStr(today);
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const cells: React.ReactNode[] = [];
        for (let i = 0; i < startDay; i++) cells.push(<div key={`e-${i}`} />);

        for (let d = 1; d <= lastDay.getDate(); d++) {
            const date = new Date(year, month, d);
            const dateStr = formatDateStr(date);
            const isPast = date < todayStart;
            const isBooked = isDateBooked(dateStr);
            const isToday = dateStr === todayStr;
            const selected = selectedDates.includes(dateStr);

            let cls = 'calendar-day p-2 rounded-lg text-sm text-center';
            if (isPast) cls += ' disabled';
            else if (isBooked) cls += ' booked';
            else if (selected) cls += ' selected';
            if (isToday) cls += ' today';

            cells.push(
                <div key={dateStr} className={cls} onClick={() => toggleDate(dateStr)}>{d}</div>
            );
        }
        return cells;
    };

    return (
        <section id="reservar" className="relative py-24">
            <div className="blob left-1/2 top-0 -translate-x-1/2" style={{ width: 384, height: 384, backgroundColor: '#2563eb' }} />
            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="mb-12 text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#fbbf24' }}>Reserva en línea</span>
                    <h2 className="font-serif mt-3 text-4xl font-bold md:text-5xl text-heading">
                        Sistema de <span className="gradient-text">reservas</span>
                    </h2>
                    <p className="mt-2 text-muted">Selecciona tu vehículo, fechas y completa tu reserva en tiempo real.</p>
                </div>

                <div className="glass-nav rounded-3xl border p-6 md:p-10" style={{ borderColor: 'rgba(59,130,246,0.2)' }}>
                    {step !== 'success' && (
                        <div className="mx-auto mb-10 flex max-w-2xl items-center justify-between">
                            {['Vehículo', 'Fechas', 'Pago', 'Firma'].map((label, i) => {
                                const s = (i + 1) as 1 | 2 | 3 | 4;
                                const isActive = step === s;
                                const isDone = typeof step === 'number' && step > s;
                                return (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={`flex size-10 items-center justify-center rounded-full text-sm font-bold ${isDone ? 'step-done' : isActive ? 'step-active' : 'step-inactive'}`}>
                                            {isDone ? '✓' : s}
                                        </div>
                                        <span className={`hidden text-sm font-medium sm:inline ${!isActive && !isDone ? 'text-muted' : ''} ${isActive ? 'text-heading' : ''}`}>
                                            {label}
                                        </span>
                                        {i < 3 && <div className="line-bg mx-2 h-0.5 w-8 sm:w-12 md:w-16" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-heading">Selecciona un vehículo</h3>
                            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {vehiclesData.map(v => (
                                    <div
                                        key={v.id}
                                        onClick={() => setSelectedVehicleId(v.id)}
                                        className={`vehicle-card card card-hover cursor-pointer overflow-hidden rounded-xl ${selectedVehicleId === v.id ? 'selected' : ''}`}
                                    >
                                        <div className="relative h-32 overflow-hidden">
                                            <img src={v.image} alt={v.name} className="size-full object-cover" />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-serif font-bold text-heading">{v.name}</h4>
                                            <div className="mb-2 text-xs text-muted">👥 {v.seats} asientos · ⚙ {v.transmission}</div>
                                            <div className="font-bold gradient-text">${v.price}<span className="text-xs font-normal text-faint">/día</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button onClick={() => setStep(2)} disabled={!selectedVehicleId} className="btn-primary rounded-full px-8 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50">Continuar →</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-heading">Selecciona las fechas</h3>
                            <div className="mt-6 grid gap-8 md:grid-cols-2">
                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <button onClick={() => changeMonth(-1)} className="card rounded-lg p-2 transition hover:bg-blue-500/20">
                                            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <h4 className="font-serif text-xl font-bold text-heading">
                                            {MONTH_NAMES[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                                        </h4>
                                        <button onClick={() => changeMonth(1)} className="card rounded-lg p-2 transition hover:bg-blue-500/20">
                                            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-faint">
                                        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d => <div key={d}>{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">{renderCalendarCells()}</div>
                                    <div className="mt-4 flex flex-wrap gap-4 text-xs">
                                        <div className="flex items-center gap-2"><div className="size-4 rounded bg-blue-500" />Seleccionado</div>
                                        <div className="flex items-center gap-2"><div className="size-4 rounded bg-blue-500/20 border border-blue-500/30" />Rango</div>
                                        <div className="flex items-center gap-2"><div className="size-4 rounded bg-red-500/30" />Ocupado</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="card rounded-2xl p-6">
                                        <div className="mb-2 text-sm text-muted">Resumen de tu reserva</div>
                                        <button onClick={() => setStep(1)} className="font-serif text-xl font-bold text-heading transition hover:text-amber-400">{selectedVehicle?.name || '—'}</button>
                                        <div className="mt-4 space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-muted">Recogida:</span><span className="font-semibold text-heading">{minDate || '—'}</span></div>
                                            <div className="flex justify-between"><span className="text-muted">Devolución:</span><span className="font-semibold text-heading">{maxDate && minDate !== maxDate ? maxDate : '—'}</span></div>
                                            <div className="flex justify-between"><span className="text-muted">Días:</span><span className="font-semibold text-heading">{totalDays > 0 ? `${totalDays} días` : '—'}</span></div>
                                            {totalDays > 0 && (
                                                <>
                                                    <div className="divider my-3" />
                                                    <div className="flex justify-between"><span className="text-muted">Subtotal:</span><span className="font-semibold text-heading">${subtotal.toLocaleString()} MXN</span></div>
                                                    <div className="flex justify-between"><span className="text-muted">Seguro (15%):</span><span className="font-semibold text-heading">${insurance.toLocaleString()} MXN</span></div>
                                                    <div className="flex justify-between"><span className="text-muted">Impuestos (16%):</span><span className="font-semibold text-heading">${tax.toLocaleString()} MXN</span></div>
                                                </>
                                            )}
                                            <div className="divider my-3" />
                                            <div className="flex items-center justify-between text-lg">
                                                <span className="font-semibold text-heading">Total:</span>
                                                <span className="gradient-text text-2xl font-bold">{totalDays > 0 ? `$${grandTotal.toLocaleString()} MXN` : '—'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <button onClick={() => setStep(1)} className="rounded-full border px-6 py-3 text-sm font-medium transition hover:border-blue-500" style={{ borderColor: 'rgba(59,130,246,0.3)' }}>← Atrás</button>
                                        <button onClick={() => setStep(3)} disabled={selectedDates.length < 2} className="rounded-full px-8 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50" style={{ backgroundColor: '#3b82f6', color: 'white' }}>Continuar →</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-heading">Pago seguro</h3>
                            <div className="mt-6 grid gap-8 md:grid-cols-2">
                                <div className="card rounded-2xl p-8">
                                    <div className="mb-6 flex items-center gap-3">
                                        <div className="flex size-12 items-center justify-center rounded text-xs font-bold text-white" style={{ background: 'linear-gradient(to right, #2563eb, #1e40af)' }}>VISA</div>
                                        <div className="flex size-12 items-center justify-center rounded text-xs font-bold text-white" style={{ background: 'linear-gradient(to right, #ef4444, #b91c1c)' }}>MC</div>
                                        <div className="flex size-12 items-center justify-center rounded text-xs font-bold" style={{ background: 'linear-gradient(to right, #fbbf24, #d97706)', color: '#020617' }}>AMEX</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-xs uppercase tracking-wider text-muted">Número de tarjeta</label>
                                            <input type="text" maxLength={19} placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(formatCardInput(e.target.value))} className="input-dark w-full rounded-lg px-4 py-3 text-sm" />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs uppercase tracking-wider text-muted">Titular</label>
                                            <input type="text" placeholder="NOMBRE APELLIDO" className="input-dark w-full rounded-lg px-4 py-3 text-sm uppercase" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="mb-2 block text-xs uppercase tracking-wider text-muted">Vencimiento</label>
                                                <input type="text" maxLength={5} placeholder="MM/AA" className="input-dark w-full rounded-lg px-4 py-3 text-sm" onInput={(e) => { (e.target as HTMLInputElement).value = formatExpiryInput((e.target as HTMLInputElement).value); }} />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs uppercase tracking-wider text-muted">CVV</label>
                                                <input type="text" maxLength={4} placeholder="123" className="input-dark w-full rounded-lg px-4 py-3 text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center gap-3 rounded-lg p-4" style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                                        <svg className="size-5 shrink-0" style={{ color: '#34d399' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        <span className="text-xs" style={{ color: '#6ee7b7' }}>Pago encriptado con certificación PCI-DSS. Tus datos están 100% seguros.</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="card rounded-2xl p-6">
                                        <div className="mb-4 text-sm text-muted">Resumen final</div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-muted">Vehículo:</span><button onClick={() => setStep(1)} className="font-semibold text-heading transition hover:text-amber-400">{selectedVehicle?.name || '—'}</button></div>
                                            <div className="flex justify-between"><span className="text-muted">Período:</span><span className="font-semibold text-heading">{minDate} → {maxDate} ({totalDays} días)</span></div>
                                            <div className="flex justify-between"><span className="text-muted">Subtotal:</span><span className="font-semibold text-heading">${subtotal.toLocaleString()} MXN</span></div>
                                            <div className="flex justify-between"><span className="text-muted">Seguro:</span><span className="font-semibold text-heading">${insurance.toLocaleString()} MXN</span></div>
                                            <div className="flex justify-between"><span className="text-muted">Impuestos (16%):</span><span className="font-semibold text-heading">${tax.toLocaleString()} MXN</span></div>
                                            <div className="divider my-3" />
                                            <div className="flex items-center justify-between text-lg">
                                                <span className="font-semibold text-heading">Total:</span>
                                                <span className="gradient-text text-2xl font-bold">${grandTotal.toLocaleString()} MXN</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <button onClick={() => setStep(2)} className="rounded-full border px-6 py-3 text-sm font-medium transition hover:border-blue-500" style={{ borderColor: 'rgba(59,130,246,0.3)' }}>← Atrás</button>
                                        <button onClick={() => setStep(4)} className="rounded-full px-8 py-3 font-bold transition hover:scale-105" style={{ background: 'linear-gradient(to right, #fbbf24, #f59e0b)', color: '#020617' }}>Pagar y continuar →</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-heading">Firma digital del contrato</h3>
                            <p className="mb-6 text-muted">Dibuja tu firma en el recuadro. Tiene validez legal según la Ley de Firma Electrónica.</p>
                            <div className="grid gap-8 md:grid-cols-2">
                                <div className="card rounded-2xl p-6">
                                    <div className="mb-3 text-sm text-muted">Contrato de alquiler</div>
                                    <div className="mb-4 max-h-48 overflow-y-auto text-xs leading-relaxed text-faint">
                                        <p className="mb-2"><strong className="text-body">CONTRATO DE ARRENDAMIENTO DE VEHÍCULO</strong></p>
                                        <p className="mb-2">Entre DriveLux S.A. de C.V. (arrendador) y el cliente (arrendatario), se establece el presente contrato de arrendamiento del vehículo seleccionado, bajo las siguientes condiciones:</p>
                                        <p className="mb-2">1. El arrendatario se compromete a utilizar el vehículo exclusivamente para fines personales y dentro del territorio nacional.</p>
                                        <p className="mb-2">2. El período de arrendamiento será el indicado en la reserva, con posibilidad de extensión previa autorización.</p>
                                        <p className="mb-2">3. El arrendatario es responsable de cualquier daño causado al vehículo durante el período de arrendamiento.</p>
                                        <p className="mb-2">4. El pago se realizará en su totalidad al momento de la firma del presente contrato.</p>
                                        <p className="mb-2">5. La cancelación puede realizarse hasta 24 horas antes de la fecha de recogida sin penalización.</p>
                                        <p>Al firmar este contrato, el arrendatario acepta todos los términos y condiciones establecidos.</p>
                                    </div>
                                    <div className="space-y-1 border-t pt-4 text-xs text-faint" style={{ borderColor: 'rgba(59,130,246,0.15)' }}>
                                        <p><strong className="text-body">Cliente:</strong> <span className="text-heading">{clientName || '—'}</span></p>
                                        <p><strong className="text-body">Vehículo:</strong> <button onClick={() => setStep(1)} className="text-heading transition hover:text-amber-400">{selectedVehicle?.name || '—'}</button></p>
                                        <p><strong className="text-body">Período:</strong> <span className="text-heading">{minDate && maxDate ? `${minDate} → ${maxDate}` : '—'}</span></p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="card rounded-2xl p-6">
                                        <label className="mb-2 block text-xs uppercase tracking-wider text-muted">Tu nombre completo</label>
                                        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Juan Pérez García" className="input-dark mb-4 w-full rounded-lg px-4 py-3 text-sm" />
                                        <label className="mb-2 block text-xs uppercase tracking-wider text-muted">Firma aquí</label>
                                        <canvas ref={canvasRef} className="signature-pad input-dark w-full rounded-lg" style={{ height: 192 }} />
                                        <div className="mt-3 flex justify-between">
                                            <button onClick={clearSignature} className="text-xs text-muted transition hover:text-amber-400">🗑 Limpiar firma</button>
                                            <span className={`text-xs ${signatureStatus.includes('✓') ? '' : 'text-faint'}`} style={signatureStatus.includes('✓') ? { color: '#34d399' } : {}}>{signatureStatus}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <button onClick={() => setStep(3)} className="rounded-full border px-6 py-3 text-sm font-medium transition hover:border-blue-500" style={{ borderColor: 'rgba(59,130,246,0.3)' }}>← Atrás</button>
                                        <button onClick={completeBooking} className="rounded-full px-8 py-3 font-bold text-white transition hover:scale-105" style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}>✓ Completar reserva</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="slide-in py-12 text-center">
                            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                <svg className="size-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-3xl font-bold text-heading">¡Reserva confirmada!</h3>
                            <p className="mb-6 text-muted">Hemos enviado los detalles de tu reserva y el contrato firmado a tu correo electrónico.</p>
                            <div className="mx-auto inline-block max-w-md rounded-2xl border p-6 text-left card-dark-bg" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
                                <div className="mb-2 text-xs text-muted">Número de reserva</div>
                                <div className="gradient-text mb-4 font-serif text-2xl font-bold">{bookingNum}</div>
                                <div className="mb-1 text-xs text-muted">Recuerda presentar:</div>
                                <ul className="space-y-1 text-sm text-body">
                                    <li>• Identificación oficial vigente</li>
                                    <li>• Licencia de conducir</li>
                                    <li>• Tarjeta de crédito a nombre del titular</li>
                                </ul>
                            </div>
                            <button onClick={resetBooking} className="btn-primary mx-auto mt-8 block rounded-full px-8 py-3 font-semibold transition hover:scale-105">Hacer otra reserva</button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}