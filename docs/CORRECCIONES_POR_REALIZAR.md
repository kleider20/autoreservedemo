# AutoReserveDemo — Correcciones por Realizar

> Lista priorizada de mejoras para transformar el starter kit en un sistema de auto-reservas completo.

---

## ✅ Completadas

| # | Mejora | Estado |
|---|--------|--------|
| 21 | Sistema de Templates WordPress-style | ✅ Instalado y funcional |
| 21a | Migraciones `layout_templates` y `layout_assignments` | ✅ Creadas |
| 21b | Modelos `LayoutTemplate` y `LayoutAssignment` | ✅ Creados |
| 21c | `TemplateManager` service (instalar, activar, desactivar, eliminar) | ✅ Creado |
| 21d | `TemplateController` + rutas admin | ✅ Creado |
| 21e | Templates base: Landing + Dashboard | ✅ Creados |
| 21f | Páginas admin React (index, upload, assign) | ✅ Creadas |
| 21g | Componentes UI (template-card, template-uploader, template-selector) | ✅ Creados |
| 21h | Seeders para templates por defecto | ✅ Creados |
| 21i | Comando `php artisan template:build-zip` | ✅ Creado |
| 21j | Archivos .zip de ejemplo generados | ✅ En `storage/app/templates/samples/` |

---

## 🔴 Prioridad Alta (Debe hacerse antes de producción)

### 1. Migrar Base de Datos a MySQL/PostgreSQL
- **Problema**: SQLite no soporta concurrencia real (escrituras simultáneas fallan).
- **Acción**: Cambiar `DB_CONNECTION=sqlite` a `mysql` o `pgsql` en `.env`.
- **Archivos**: `.env`, `config/database.php`.
- **Tests**: Actualizar `phpunit.xml` si usa SQLite in-memory para tests.

### 2. Cambiar Session/Cache/Queue Driver
- **Problema**: `SESSION_DRIVER=database`, `CACHE_STORE=database`, `QUEUE_CONNECTION=database` — todo usa la DB, agregando latencia.
- **Acción**: 
  - Session: usar `file` o `cookie`
  - Cache: usar `file` o `redis`
  - Queue: usar `redis` o `sync` para dev
- **Archivos**: `.env`, `config/session.php`, `config/cache.php`, `config/queue.php`.

### 3. Agregar CI/CD (GitHub Actions)
- **Problema**: No hay automatización de pruebas ni lint en commits/PRs.
- **Acción**: Crear `.github/workflows/tests.yml` con:
  - `composer install` + `npm ci`
  - `npm run lint` + `npm run types:check`
  - `php artisan test --compact`
  - `vendor/bin/pint --format agent` (o al menos `--test`)

### 4. Agregar Testing Frontend
- **Problema**: No hay tests de componentes React. Vitest + React Testing Library son necesarios.
- **Acción**:
  - Instalar `vitest`, `@testing-library/react`, `@testing-library/jest-dom`
  - Crear `vitest.config.ts`
  - Escribir tests para componentes críticos (formularios de auth, settings)

### 5. Crear Modelos de Dominio Base
- **Problema**: Solo existe `User`. Sin vehículos, reservaciones, clientes, pagos.
- **Acción**: Crear con `php artisan make:model -mfsc`:
  - `Vehicle` — marca, modelo, año, placa, tarifa diaria, disponible, imagen
  - `Reservation` — user_id, vehicle_id, fecha_inicio, fecha_fin, estado, total
  - `Client` — user_id, teléfono, dirección, licencia
  - `Payment` — reservation_id, monto, método, estado, transaction_id
- **Nota**: Crear factories y tests junto con cada modelo.

---

## 🟡 Prioridad Media

### 6. Implementar spatie/laravel-data (DTOs)
- **Problema**: Se pasan datos de Eloquent directamente a Inertia sin transformación.
- **Acción**: Crear `app/Data/` con clases DTO para cada modelo.
- **Ejemplo**: `VehicleData`, `ReservationData`, `UserData`.
- **Instalación**: `composer require spatie/laravel-data`

### 7. Agregar Policies de Autorización
- **Problema**: No hay `app/Policies/`. Sin control de acceso por roles.
- **Acción**: Crear `php artisan make:policy` para cada modelo.
- **Ejemplo**: `VehiclePolicy`, `ReservationPolicy`.
- **Registrar** en `AppServiceProvider` o `AuthServiceProvider`.

### 8. Implementar Eventos y Listeners
- **Problema**: Sin eventos de dominio. Todo el código es procedural.
- **Acción**: Crear eventos:
  - `ReservationCreated` → Listener: `SendConfirmationNotification`
  - `ReservationCancelled` → Listener: `ReleaseVehicleAvailability`
  - `PaymentReceived` → Listener: `ConfirmReservation`

### 9. Agregar Notificaciones por Email
- **Problema**: Sin notificaciones para el usuario (confirmaciones, recordatorios).
- **Acción**: Crear Mailables/Notifications:
  - `ReservationConfirmation` — Detalles de la reserva
  - `ReservationReminder` — 24h antes de la reserva
  - `PaymentReceipt` — Comprobante de pago

### 10. Configurar Tareas Programadas (Schedule)
- **Problema**: Sin `app/Console/Kernel.php` ni schedule definidos.
- **Acción**: En `bootstrap/app.php` con `->withSchedule()`, agregar:
  - `reservations:clean-expired` — Cancelar reservas no confirmadas > 1h
  - `reservations:send-reminders` — Enviar recordatorios 24h antes
  - `vehicles:check-availability` — Liberar vehículos automáticamente

---

## 🟢 Prioridad Baja

### 11. Crear Documentación Faltante
- **Problema**: Los `docs/` recién se crearon. Faltan completar algunos.
- **Acción**: Mantener actualizados `AGENTS.md`, `ARCHITECTURE.md`, etc.

### 12. Agregar Rutas API
- **Problema**: No hay `routes/api.php`. Sin soporte para mobile o integraciones.
- **Acción**: Crear rutas API versionadas (`/api/v1/...`) con API Resources.

### 13. Implementar Tiempo Real (WebSockets)
- **Problema**: Sin actualizaciones en tiempo real.
- **Acción**: Instalar `laravel/reverb` para WebSockets.
- **Uso**: Notificar disponibilidad de vehículos, confirmaciones de reserva.

### 14. Agregar Panel de Administración
- **Problema**: Sin interfaz admin para gestionar el sistema.
- **Acción**: Crear rutas prefix `/admin/` con middleware `admin` + policy.

### 15. Integrar Pasarela de Pagos
- **Problema**: Sin pagos reales.
- **Acción**: Integrar Stripe o MercadoPago (según mercado objetivo).
- **Flujo**: Reservar → Pagar → Confirmar.

### 16. Agregar Monitoreo (Laravel Pulse / Telescope)
- **Problema**: Sin visibilidad de rendimiento, queries lentas, errores.
- **Acción**: Instalar `laravel/pulse` para producción, `laravel/telescope` para dev.

### 17. Dashboard con Métricas Reales
- **Problema**: Dashboard actual es plantilla vacía.
- **Acción**: Agregar widgets:
  - Reservaciones activas (hoy/esta semana)
  - Ingresos del mes
  - Vehículos disponibles vs ocupados
  - Próximas reservaciones
  - Clientes nuevos

### 18. Roles y Permisos (Spatie Permission)
- **Problema**: Sin diferenciación entre admin y cliente.
- **Acción**: `composer require spatie/laravel-permission`
- **Roles**: `admin`, `client`
- **Permisos**: `create-vehicles`, `edit-vehicles`, `delete-vehicles`, `manage-reservations`

### 19. Optimizar Imágenes
- **Problema**: Sin manejo de imágenes para vehículos.
- **Acción**: Usar `spatie/laravel-medialibrary` o intervención image + WebP conversion.

### 20. Agregar ESLint + Prettier pre-commit hooks
- **Problema**: Sin enforce automático de calidad de código.
- **Acción**: Instalar `husky` + `lint-staged` para ejecutar lint/format en cada commit.

---

## 📊 Resumen de Esfuerzo Estimado

| Prioridad | Items | Esfuerzo Estimado |
|-----------|-------|-------------------|
| 🔴 Alta | 5 | 2-3 días |
| 🟡 Media | 5 | 3-5 días |
| 🟢 Baja | 11 | 5-7 días |
| **Total** | **21** | **10-15 días** |

---

## ✅ Checklist de Progreso

- [ ] 1. Base de datos MySQL/PostgreSQL
- [ ] 2. Session/Cache/Queue drivers optimizados
- [ ] 3. CI/CD con GitHub Actions
- [ ] 4. Testing frontend (Vitest)
- [ ] 5. Modelos de dominio (Vehicle, Reservation, etc.)
- [ ] 6. DTOs con spatie/laravel-data
- [ ] 7. Policies de autorización
- [ ] 8. Eventos y Listeners
- [ ] 9. Notificaciones por email
- [ ] 10. Tareas programadas (Schedule)
- [ ] 11. Documentación mantenida
- [ ] 12. Rutas API
- [ ] 13. Tiempo real (Reverb)
- [ ] 14. Panel admin
- [ ] 15. Pagos integrados
- [ ] 16. Monitoreo (Pulse/Telescope)
- [ ] 17. Dashboard con métricas
- [ ] 18. Roles y permisos
- [ ] 19. Optimización de imágenes
- [ ] 20. Pre-commit hooks
- [ ] 21. Regenerar rutas Wayfinder (`php artisan wayfinder:generate`)

## 🆕 Nueva funcionalidad: Sistema de Templates

Se implementó un sistema completo de gestión de templates al estilo WordPress:

| Componente | Archivo |
|-----------|---------|
| Migraciones | `database/migrations/*create_layout_templates*` y `*create_layout_assignments*` |
| Modelos | `app/Models/LayoutTemplate.php`, `app/Models/LayoutAssignment.php` |
| Servicio | `app/Services/TemplateManager.php` |
| Controlador | `app/Http/Controllers/Admin/TemplateController.php` |
| Validación | `app/Http/Requests/Admin/StoreTemplateRequest.php` |
| Rutas | `routes/admin.php` (prefijo `/admin/templates`) |
| Templates base | `resources/js/layouts/landing/` y `resources/js/layouts/dashboard/` |
| Páginas admin | `resources/js/pages/admin/templates/{index,upload,assign}.tsx` |
| Componentes | `resources/js/components/template-{card,uploader,selector}.tsx` |
| Comando | `php artisan template:build-zip` genera .zip de ejemplo |
| Seeders | `database/seeders/TemplateSeeder.php` registra templates por defecto |
| ZIPs ejemplo | `storage/app/templates/samples/{landing,dashboard}.zip` |