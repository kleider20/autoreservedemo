export interface Vehicle {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    specs: string[];
    rating: number;
    reviews: number;
}

export const vehicles: Vehicle[] = [
    { id: 1, name: 'BMW X5', category: 'suv', price: 89, image: 'https://placehold.co/600x400/1a1a2e/ffffff?text=BMW+X5', specs: ['5 asientos', 'Diesel', 'Automático'], rating: 4.8, reviews: 124 },
    { id: 2, name: 'Audi Q7', category: 'suv', price: 95, image: 'https://placehold.co/600x400/16213e/ffffff?text=Audi+Q7', specs: ['7 asientos', 'Gasolina', 'Automático'], rating: 4.7, reviews: 98 },
    { id: 3, name: 'Mercedes-Benz GLE', category: 'suv', price: 99, image: 'https://placehold.co/600x400/0f3460/ffffff?text=Mercedes+GLE', specs: ['5 asientos', 'Híbrido', 'Automático'], rating: 4.9, reviews: 156 },
    { id: 4, name: 'Tesla Model S', category: 'sedan', price: 79, image: 'https://placehold.co/600x400/1a1a2e/ffffff?text=Tesla+Model+S', specs: ['5 asientos', 'Eléctrico', 'Automático'], rating: 4.8, reviews: 203 },
    { id: 5, name: 'BMW Serie 7', category: 'luxury', price: 149, image: 'https://placehold.co/600x400/16213e/ffffff?text=BMW+Serie+7', specs: ['5 asientos', 'Gasolina', 'Automático'], rating: 4.9, reviews: 87 },
    { id: 6, name: 'Porsche 911', category: 'sports', price: 199, image: 'https://placehold.co/600x400/0f3460/ffffff?text=Porsche+911', specs: ['2 asientos', 'Gasolina', 'Automático'], rating: 4.9, reviews: 145 },
    { id: 7, name: 'Audi A6', category: 'sedan', price: 69, image: 'https://placehold.co/600x400/1a1a2e/ffffff?text=Audi+A6', specs: ['5 asientos', 'Diesel', 'Automático'], rating: 4.6, reviews: 112 },
    { id: 8, name: 'Range Rover Sport', category: 'luxury', price: 179, image: 'https://placehold.co/600x400/16213e/ffffff?text=Range+Rover', specs: ['5 asientos', 'Diesel', 'Automático'], rating: 4.8, reviews: 78 },
];

export interface Testimonial {
    id: number;
    name: string;
    role: string;
    avatar: string;
    quote: string;
    rating: number;
}

export const testimonials: Testimonial[] = [
    { id: 1, name: 'Carlos Mendoza', role: 'Viajero frecuente', avatar: 'https://placehold.co/80x80/1a1a2e/ffffff?text=CM', quote: 'Servicio excepcional. El proceso de reserva fue muy sencillo y el vehículo estaba en perfectas condiciones. Sin duda repetiré.', rating: 5 },
    { id: 2, name: 'Ana García', role: 'Ejecutiva corporativa', avatar: 'https://placehold.co/80x80/16213e/ffffff?text=AG', quote: 'La flota de vehículos de lujo es impresionante. Me encantó la atención personalizada y la flexibilidad en los horarios.', rating: 5 },
    { id: 3, name: 'Roberto Sánchez', role: 'Turista internacional', avatar: 'https://placehold.co/80x80/0f3460/ffffff?text=RS', quote: 'Alquilar un auto nunca fue tan fácil. Reservé desde el aeropuerto y todo estaba listo al llegar. Muy recomendable.', rating: 5 },
];

export interface Feature {
    id: number;
    icon: string;
    title: string;
    description: string;
}

export const features: Feature[] = [
    { id: 1, icon: 'ShieldCheck', title: 'Seguro Premium', description: 'Todos nuestros vehículos cuentan con seguro a todo riesgo sin franquicia. Conduce con total tranquilidad.' },
    { id: 2, icon: 'Headphones', title: 'Soporte 24/7', description: 'Nuestro equipo de soporte está disponible las 24 horas del día, los 7 días de la semana para ayudarte.' },
    { id: 3, icon: 'MapPin', title: 'Entrega Flexible', description: 'Recoge y devuelve el vehículo en cualquier ubicación. Aeropuerto, hotel o domicilio particular.' },
];

export interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

export const faqItems: FaqItem[] = [
    { id: 1, question: '¿Qué requisitos necesito para alquilar un vehículo?', answer: 'Necesitas ser mayor de 21 años, tener licencia de conducir vigente con al menos 2 años de antigüedad, y una tarjeta de crédito a tu nombre para el depósito de garantía.' },
    { id: 2, question: '¿Puedo modificar o cancelar mi reserva?', answer: 'Sí, puedes modificar o cancelar tu reserva sin cargo hasta 48 horas antes del inicio del alquiler. Cancelaciones dentro de las 48 horas pueden tener cargos aplicables.' },
    { id: 3, question: '¿Incluyen seguro los vehículos?', answer: 'Todos nuestros alquileres incluyen seguro a todo riesgo con cobertura completa. También ofrecemos coberturas adicionales como protección de cristales y llantas.' },
    { id: 4, question: '¿Puedo devolver el vehículo en otra ubicación?', answer: 'Sí, ofrecemos servicio de devolución en ubicaciones diferentes. Consulta los cargos adicionales según las ubicaciones al momento de hacer tu reserva.' },
    { id: 5, question: '¿Qué hago si tengo un accidente?', answer: 'En caso de accidente, contacta inmediatamente a nuestra línea de emergencia 24/7. Te guiaremos en todo el proceso y gestionaremos la asistencia en carretera.' },
];

export const processSteps = [
    { number: '01', title: 'Busca', description: 'Elige entre nuestra amplia flota de vehículos premium', icon: 'Search' },
    { number: '02', title: 'Selecciona', description: 'Escoge las fechas y el vehículo que más te guste', icon: 'CheckSquare' },
    { number: '03', title: 'Reserva', description: 'Completa el pago de forma segura y rápida', icon: 'CreditCard' },
    { number: '04', title: 'Conduce', description: 'Recoge tu vehículo y disfruta del viaje', icon: 'Car' },
];

export const stats = [
    { value: '200+', label: 'Vehículos' },
    { value: '10K+', label: 'Clientes' },
    { value: '4.9', label: 'Valoración' },
    { value: '5+', label: 'Años' },
];

export const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'sedan', label: 'Sedán' },
    { value: 'suv', label: 'SUV' },
    { value: 'luxury', label: 'Lujo' },
    { value: 'sports', label: 'Deportivo' },
];

export const bookedDates: string[] = [
    '2026-08-15', '2026-08-16', '2026-08-17',
    '2026-08-22', '2026-08-23',
    '2026-09-05', '2026-09-06', '2026-09-07',
    '2026-09-12', '2026-09-13',
];