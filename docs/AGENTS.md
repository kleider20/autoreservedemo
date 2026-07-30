# AutoReserveDemo — Documentation-First Context for AI Agents

## Project Overview

AutoReserveDemo is a **vehicle reservation system** built with Laravel 13 + Inertia.js v3 + React 19. It uses Laravel Fortify for authentication (passkeys/WebAuthn, 2FA TOTP, email verification, password reset) and Tailwind CSS v4 for styling with a full dark mode system.

---

## MANDATORY: Read These Files BEFORE Generating Code

When working on the AutoReserveDemo project, you MUST consult these files first:

1. `docs/ARCHITECTURE.md` — Folder structure, data flow, Inertia routing, state management
2. `docs/STYLE_GUIDE.md` — Design tokens, Tailwind v4 config, color system, component variants
3. `docs/SECURITY.md` — Validation rules, sanitization, authorization policies
4. `docs/LOGIC_ARCHITECTURE.md` — Estructura de dominio en espejo (Actions, Data, Requests), nomenclatura de Layouts (Wrappers/Templates) y estructura de formularios
5. `docs/DESIGN.md` — Design system UI/UX patterns, layout variants, responsive breakpoints
6. `docs/CORRECCIONES_POR_REALIZAR.md` — Lista priorizada de mejoras y correcciones pendientes

---

## Project Constraints

- **PHP 8.3** — Use constructor property promotion, typed properties, and strict types
- **Laravel 13** — Uses `bootstrap/app.php` instead of `Kernel.php` / `ExceptionHandler.php`
- **Inertia v3** — Uses `@inertiajs/react` with SSR enabled. Use `Inertia::defer()` for deferred props, never `Inertia::lazy()`
- **React 19** — Functional components only. Hooks over lifecycle methods
- **Tailwind CSS v4** — Uses `@theme` directive with OKLCH color tokens. NEVER hardcode hex colors
- **TypeScript strict** — `strict: true` in tsconfig.json. All components must be typed
- **Fortify** — Frontend-agnostic auth backend. All auth views are Inertia pages
- **Wayfinder** — Use generated route functions from `@/routes/` and action functions from `@/actions/`

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| PHP classes | PascalCase | `CreateNewUser` |
| Form Requests | PascalCase + suffix | `ProfileUpdateRequest` |
| Actions | PascalCase | `ReserveVehicleAction` |
| Migrations | snake_case | `2025_01_01_create_vehicles_table` |
| Vue/React files | kebab-case | `stats-card.tsx` |
| Page files | kebab-case | `my-reservations.tsx` |
| Layout files | kebab-case | `app-sidebar-layout.tsx` |
| Routes | kebab-case | `/admin/vehicles/create` |
| Database tables | snake_case plural | `vehicles`, `reservations` |
| Config keys | snake_case | `fortify.home` |

---

## Tech Stack Reference

| Package | Version | Role |
|---------|---------|------|
| `laravel/framework` | ^13.17 | Backend framework |
| `inertiajs/inertia-laravel` | ^3.0 | Inertia server adapter |
| `@inertiajs/react` | ^3.0 | Inertia client adapter |
| `laravel/fortify` | ^1.37 | Authentication backend |
| `laravel/wayfinder` | ^0.1 | Type-safe route generation |
| `react` | ^19.2 | UI library |
| `tailwindcss` | ^4.0 | Utility CSS framework |
| `lucide-react` | ^0.475 | Icon library |
| `radix-ui/*` | latest | Headless UI primitives |
| `pestphp/pest` | ^4.7 | PHP testing |
| `laravel/pint` | ^1.27 | PHP code style |
| `eslint` | ^10.8 | JS/TS linting |
| `prettier` | ^3.9 | JS/TS formatting |

---

---

## 🛠️ Correction Workflow (Obbligatorio)

Cada vez que el usuario pida una corrección, mejora o nueva funcionalidad, DEBES seguir este flujo:

### Alcance
Esta regla aplica a **todo**: correcciones, mejoras, nuevas funcionalidades, módulos CRUD completos, sistemas nuevos (pagos, roles, notificaciones, APIs, etc.), refactors, cambios de configuración, y cualquier modificación al proyecto que no sea estrictamente un bugfix urgente.

### 1. Consultar `docs/CORRECCIONES_POR_REALIZAR.md`
- Antes de hacer cualquier cambio, abre y lee el archivo completo.
- Verifica si la mejora/funcionalidad/CRUD ya está listada.

### 2. Si YA existe en el archivo
- **NO** la dupliques.
- Solo responde al usuario indicando que **ya está registrada como pendiente** y en qué prioridad se encuentra.
- Si el usuario quiere ejecutarla ahora, continúa con el paso 4.

### 3. Si NO existe en el archivo
- Agrégala al archivo `docs/CORRECCIONES_POR_REALIZAR.md`.
- Asígnale una prioridad (`🔴 Alta`, `🟡 Media`, `🟢 Baja`).
- Colócala en la sección correspondiente manteniendo el orden existente.
- Informa al usuario que fue agregada.

### 4. Al ejecutar una corrección
- Implementa los cambios necesarios en el proyecto.
- Una vez aplicada y verificada (tests pasan, lint ok), **elimínala** del archivo `docs/CORRECCIONES_POR_REALIZAR.md`.
- Si la corrección estaba en la sección de alta/media/baja, reacomoda el checklist de progreso al final del archivo.

### 5. Al revisar correcciones pendientes
- Cuando el usuario pida "revisa las correcciones" o similar, abre `docs/CORRECCIONES_POR_REALIZAR.md` y preséntale el listado actual con prioridades.

---

## Quick Commands

```bash
# Development
composer run dev          # Starts server + queue + vite concurrently
npm run dev               # Vite dev only
php artisan serve         # Laravel server
php artisan reverb:start  # WebSocket server (when implemented)

# Quality
composer run lint         # PHPStan + Pint
npm run lint              # ESLint
npm run format            # Prettier
npm run types:check       # TypeScript check

# Testing
composer run test         # Full Pest test suite
php artisan test --compact --filter=test_name

# Build
npm run build             # Production frontend build