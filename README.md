# 🚗 AutoReserve Demo

Sistema de reserva de vehículos premium desarrollado con **Laravel + React (Inertia.js)**.

> ⚠️ **Demo** — Este proyecto es una demostración con fines de portafolio. No está destinado para uso en producción.

## ✨ Funcionalidades

- Catálogo de vehículos con filtros por categoría
- Calendario interactivo de selección de fechas (toggle individual)
- Cálculo automático de precios (subtotal, seguro, impuestos)
- Proceso de reserva en 4 pasos: Vehículo → Fechas → Pago → Firma digital
- Firma digital con canvas interactivo
- Tema oscuro/claro con detección automática del sistema
- Diseño responsivo con Tailwind CSS

## 🛠 Stack

| Tecnología | Versión |
|-----------|---------|
| PHP | 8.x |
| Laravel | 12.x |
| React | 19.x |
| Inertia.js | 3.x |
| Tailwind CSS | 4.x |
| TypeScript | 5.x |

## 🚀 Instalación

```bash
git clone <repo-url>
cd autoreservedemo
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan serve
npm run dev
```

## 📸 Preview

Incluye landing page con secciones: Hero, Flota, Cómo funciona, Reservas, Testimonios, FAQ y Footer.