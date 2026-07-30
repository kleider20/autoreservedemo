# AutoReserveDemo — Logic Architecture (Arquitectura de Dominio)

## 🪞 Principio de Espejo (Mirror Pattern)

La estructura del backend se refleja en el frontend para mantener consistencia. Cada módulo de negocio tiene su contraparte en ambos lados.

```
Backend (Laravel)          Frontend (React)
─────────────────          ─────────────────
app/Actions/               resources/js/actions/           (vía Wayfinder)
app/Http/Requests/         resources/js/components/forms/  (Formularios)
app/Models/                resources/js/types/              (Tipos compartidos)
app/Http/Controllers/      resources/js/pages/             (Páginas Inertia)
```

---

## 🏗️ Estructura de Layouts (Wrappers y Templates)

### Jerarquía de Layouts

```
TooltipProvider              ← Wrapper global
└── Toaster (Sonner)         ← Notificaciones toast
    └── resolveLayout()      ← Resuelto en app.tsx
         ├── Sin layout       → welcome
         ├── AuthLayout       → auth/*
         │    └── AuthSimpleLayout  → auth/login, auth/register, etc.
         ├── AppLayout        → dashboard, y cualquier otra ruta autenticada
         │    └── AppSidebarLayout  → layout principal con sidebar
         │         └── {page}
         └── SettingsLayout   → settings/*
              └── Contenido anidado dentro de AppLayout
```

### Reglas de Nomenclatura

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Wrappers (globales) | `{nombre}-layout.tsx` | `app-layout.tsx` |
| Templates (variantes) | `{contexto}/{nombre}-{variante}-layout.tsx` | `app/app-sidebar-layout.tsx` |
| Sub-layouts | `{contexto}/layout.tsx` | `settings/layout.tsx` |

---

## 🎯 Arquitectura de Controladores (Thin Controllers)

### Patrón Obligatorio

Los controladores NUNCA contienen lógica de negocio. Su única responsabilidad es orquestar:

```
Controller
  ├── 1. Inyectar FormRequest (validación)
  ├── 2. Llamar a un Action (lógica de negocio)
  └── 3. Retornar response (redirect ó Inertia::render)
```

### Ejemplo Estructura

```php
class ReservationController extends Controller
{
    public function store(StoreReservationRequest $request)
    {
        $reservation = CreateReservationAction::execute(
            $request->user(),
            $request->validated()
        );

        return redirect()->route('reservations.show', $reservation)
            ->with('flash', ['success' => 'Reservación creada exitosamente.']);
    }
}
```

---

## ⚡ Actions (Clases de Acción)

### Estructura

```
app/Actions/
├── Fortify/                    # Acciones del sistema auth
│   ├── CreateNewUser.php
│   └── ResetUserPassword.php
├── Vehicles/                   # Módulo Vehículos (futuro)
│   ├── CreateVehicleAction.php
│   ├── UpdateVehicleAction.php
│   └── ToggleVehicleAvailabilityAction.php
└── Reservations/               # Módulo Reservaciones (futuro)
    ├── CreateReservationAction.php
    ├── CancelReservationAction.php
    └── ConfirmReservationAction.php
```

### Convenciones

- Cada Action tiene **un solo método ejecutable** (`__invoke()` o `execute()` estático)
- Los Actions son **inyectables** via Laravel's service container
- NO deben depender de Request/Response HTTP — reciben datos planos
- Deben lanzar excepciones específicas del dominio (`ReservationConflictException`)

```php
class CreateReservationAction
{
    public function __construct(
        private VehicleService $vehicleService,
    ) {}

    public function execute(User $user, array $data): Reservation
    {
        // Validar disponibilidad
        // Crear reservación
        // Disparar evento
        return $reservation;
    }
}
```

---

## ✅ FormRequests (Validación)

### Ubicación

```
app/Http/Requests/
├── Settings/                    # Requests existentes
│   ├── ProfileUpdateRequest.php
│   ├── ProfileDeleteRequest.php
│   ├── PasswordUpdateRequest.php
│   └── TwoFactorAuthenticationRequest.php
├── Vehicles/                    # Futuro
│   ├── StoreVehicleRequest.php
│   └── UpdateVehicleRequest.php
└── Reservations/                # Futuro
    ├── StoreReservationRequest.php
    └── CancelReservationRequest.php
```

### Reglas

- **PROHIBIDO** validar inline en controladores
- Cada FormRequest es **independiente** y autocontenido
- Usar traits (`Concerns/`) para reglas reutilizables
- El método `authorize()` debe verificar policy:

```php
public function authorize(): bool
{
    return $this->user()->can('create', Reservation::class);
}
```

---

## 📦 Data Objects (spatie/laravel-data)

### Ubicación

```
app/Data/
├── UserData.php
├── VehicleData.php
├── ReservationData.php
└── ReservationCollection.php
```

### Propósito

Los DTOs transforman datos complejos de Eloquent antes de enviarlos al frontend con Inertia.

```php
use Spatie\LaravelData\Data;

class VehicleData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $plate,
        public float $dailyRate,
        public bool $isAvailable,
        public ?string $imageUrl,
    ) {}
}

// En el controlador:
public function index(): Response
{
    $vehicles = VehicleData::collection(
        Vehicle::where('is_available', true)->get()
    );

    return inertia('Vehicles/Index', [
        'vehicles' => $vehicles,
    ]);
}
```

---

## 🧩 Estructura de Formularios Frontend

### Ubicación

```
resources/js/components/forms/
├── auth/                        # Formularios de autenticación
├── vehicles/                    # Futuro: formularios de vehículos
│   ├── vehicle-form.tsx
│   └── vehicle-search-form.tsx
└── reservations/                # Futuro: formularios de reservaciones
    ├── reservation-form.tsx
    └── reservation-cancel-form.tsx
```

### Reglas

- Cada formulario es un componente React independiente
- Usar componentes `ui/` compartidos (Input, Button, Card, etc.)
- Usar `useForm` de `@inertiajs/react` para manejo de estado
- Usar funciones Wayfinder desde `@/actions/...` para submit:

```tsx
import { updateProfile } from '@/actions/App/Http/Controllers/Settings/ProfileController'

function ProfileForm({ user }: { user: User }) {
    const form = useForm({ name: user.name, email: user.email })

    function onSubmit(e: FormEvent) {
        e.preventDefault()
        form.patch(updateProfile(), {
            preserveScroll: true,
        })
    }
}
```

### Componentes Compartidos

Los componentes UI compartidos viven en `resources/js/components/shared/` para elementos reutilizables entre formularios:

```
resources/js/components/shared/
├── image-upload.tsx
├── date-picker.tsx
├── autocomplete.tsx
└── confirmation-dialog.tsx
```

---

## 🗺️ Mapa de Rutas

### Convención de Nombres

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Web (BREAD) | `/{resource}` | `/vehicles` |
| Web (single) | `/{resource}/{id}` | `/vehicles/3` |
| Admin | `/admin/{resource}` | `/admin/vehicles` |
| API | `/api/v1/{resource}` | `/api/v1/vehicles` |
| Settings | `/settings/{section}` | `/settings/profile` |

### Estructura de Archivos de Rutas

```
routes/
├── web.php                      # Rutas principales
├── settings.php                 # Rutas de configuración (ya incluida)
├── admin.php                    # Rutas de administración (futuro)
├── api.php                      # Rutas API (futuro)
└── console.php                  # Comandos Artisan
```

Cada archivo de rutas se incluye en `bootstrap/app.php`:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

---

## 🧪 Testing por Dominio

Los tests deben reflejar la misma estructura de espejo:

```
tests/
├── Feature/
│   ├── Auth/                    # Tests de autenticación
│   ├── Settings/                # Tests de configuración
│   ├── Vehicles/                # Tests del módulo vehículos (futuro)
│   ├── Reservations/            # Tests del módulo reservaciones (futuro)
│   └── ...
└── Unit/
    ├── Actions/                 # Tests unitarios de Actions
    └── ...
```

Cada módulo de dominio debe tener:
- Tests de Feature para el flujo completo (request → response)
- Tests de Unit para la lógica pura del Action
- Tests de Policy para autorización