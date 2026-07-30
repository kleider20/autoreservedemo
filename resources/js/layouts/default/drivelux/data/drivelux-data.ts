export const vehiclesData = [
  { id: 1, name: 'Audi Q7 Premium', category: 'suv', price: 1899, image: 'https://image.qwenlm.ai/public_source/2214fd40-2203-41e6-9ff1-ae9792ecc764/1c5b98c4b-6c78-4ef3-81f5-4dd4e3a5cff3.png', seats: 7, transmission: 'Automática', fuel: 'Gasolina' },
  { id: 2, name: 'Mercedes Clase E', category: 'sedan', price: 1499, image: 'https://image.qwenlm.ai/public_source/2214fd40-2203-41e6-9ff1-ae9792ecc764/119b9de27-2ed1-4658-b2ec-ab9140a91a4e.png', seats: 5, transmission: 'Automática', fuel: 'Gasolina' },
  { id: 3, name: 'Porsche 911 Cabrio', category: 'deportivo', price: 3499, image: 'https://image.qwenlm.ai/public_source/2214fd40-2203-41e6-9ff1-ae9792ecc764/183dcd408-c302-40ee-ab6d-f4e3c646a76b.png', seats: 2, transmission: 'Automática', fuel: 'Gasolina' },
  { id: 4, name: 'Toyota Corolla', category: 'compacto', price: 799, image: 'https://image.qwenlm.ai/public_source/2214fd40-2203-41e6-9ff1-ae9792ecc764/16ed5a88a-db2b-499a-bbff-7325675a5c0a.png', seats: 5, transmission: 'Automática', fuel: 'Híbrido' },
];

export const today = new Date();

export const formatDateStr = (date: Date) => date.toISOString().split('T')[0];

export const generateBookedDates = (): Record<number, string[]> => {
  const booked: Record<number, string[]> = {};
  vehiclesData.forEach(v => {
    booked[v.id] = [];
    [2, 3, 4, 10, 11, 12].forEach(offset => {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      booked[v.id].push(formatDateStr(d));
    });
  });
  return booked;
};

export const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const faqs = [
  { q: '¿Qué documentos necesito para rentar?', a: 'Identificación oficial vigente (INE o pasaporte), licencia de conducir vigente y una tarjeta de crédito a nombre del titular para el depósito de garantía.' },
  { q: '¿La firma digital tiene validez legal?', a: 'Sí. Nuestra firma digital cumple con la Ley de Firma Electrónica y tiene la misma validez legal que una firma manuscrita. Los contratos se almacenan de forma segura en la nube.' },
  { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), así como PayPal y transferencias bancarias. Todos los pagos se procesan de forma segura.' },
  { q: '¿Puedo cancelar mi reserva?', a: 'Sí. Puedes cancelar hasta 24 horas antes de la fecha de recogida sin penalización. Después de ese tiempo, se retendrá el 50% del pago como cargo por cancelación.' },
  { q: '¿El seguro está incluido en el precio?', a: 'Incluimos seguro básico contra robo y daños a terceros. Puedes contratar cobertura total por un costo adicional que se muestra claramente durante el proceso de reserva.' },
];

export const processSteps = [
  { n: 1, t: 'Selecciona', d: 'Elige tu vehículo favorito de nuestra flota premium y verifica disponibilidad en tiempo real.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { n: 2, t: 'Calendario', d: 'Selecciona fechas de recogida y devolución en nuestro calendario interactivo con disponibilidad en vivo.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { n: 3, t: 'Pago seguro', d: 'Paga con tarjeta de crédito o débito. Procesamiento encriptado con certificación PCI-DSS.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { n: 4, t: 'Firma digital', d: 'Firma tu contrato de alquiler digitalmente. Válido legalmente y almacenado en la nube de forma segura.', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
];

export const featuresData = [
  { t: 'Disponibilidad en tiempo real', d: 'Nuestro calendario se actualiza al instante. Nunca reserves un vehículo que no esté disponible.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-blue-500 to-blue-700' },
  { t: 'Pagos 100% seguros', d: 'Procesamos pagos con Stripe bajo certificación PCI-DSS. Aceptamos todas las tarjetas principales.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'from-amber-400 to-amber-600' },
  { t: 'Firma digital legal', d: 'Contratos con validez legal según la Ley de Firma Electrónica. Sin papeleo, sin filas, sin complicaciones.', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z', color: 'from-emerald-500 to-emerald-700' },
];

export const testimonialsData = [
  { n: 'Roberto Martínez', r: 'Viajero frecuente', i: 'RM', g: 'from-blue-500 to-amber-400', t: '"El proceso de reserva fue increíblemente fluido. En 5 minutos tenía mi SUV listo. La firma digital es un gran avance."' },
  { n: 'Ana López', r: 'Empresaria', i: 'AL', g: 'from-emerald-500 to-blue-500', t: '"Alquilé un deportivo para mi aniversario. El auto estaba impecable y el servicio fue de primera. 100% recomendado."' },
  { n: 'Jorge Castro', r: 'Consultor', i: 'JC', g: 'from-amber-400 to-red-500', t: '"Para viajes de trabajo es perfecto. La app es rápida, los precios justos y el soporte responde al instante."' },
];