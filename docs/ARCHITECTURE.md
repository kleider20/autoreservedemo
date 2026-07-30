# AutoReserveDemo — Architecture Guide

## 📁 Directory Structure

```
autoreservedemo/
├── app/
│   ├── Actions/
│   │   └── Fortify/              # Fortify contracts (CreateNewUser, ResetUserPassword)
│   ├── Concerns/                 # Reusable validation traits (PasswordValidationRules, ProfileValidationRules)
│   ├── Console/
│   │   └── Commands/             # Custom Artisan commands (empty — add domain commands here)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Settings/         # ProfileController, SecurityController
│   │   ├── Middleware/
│   │   │   ├── HandleAppearance.php        # Theme cookie sharing
│   │   │   └── HandleInertiaRequests.php   # Auth/user/state sharing for Inertia
│   │   └── Requests/
│   │       └── Settings/         # FormRequest validation classes
│   ├── Models/
│   │   └── User.php              # Passkey + 2FA capabilities
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── FortifyServiceProvider.php
├── bootstrap/
│   └── app.php                   # Laravel 11+ bootstrap (replaces Kernel.php + ExceptionHandler.php)
├── config/
│   ├── app.php                   # App name, timezone UTC, locale en
│   ├── auth.php                  # Web guard, Eloquent provider
│   ├── database.php              # Default SQLite, Redis config
│   ├── fortify.php               # Features: registration, 2FA, passkeys, resetPassword, emailVerification
│   ├── inertia.php               # SSR enabled, pages path
│   └── session.php               # Database driver, 120min lifetime
├── database/
│   ├── factories/
│   │   └── UserFactory.php       # With unverified / withTwoFactor states
│   ├── migrations/
│   │   ├── create_users_table.php
│   │   ├── create_cache_table.php
│   │   ├── create_jobs_table.php
│   │   ├── create_passkeys_table.php
│   │   └── add_two_factor_columns_to_users_table.php
│   └── seeders/
│       └── DatabaseSeeder.php    # Creates test@example.com user
├── resources/
│   ├── css/
│   │   └── app.css               # Tailwind v4 + theme variables (OKLCH) + dark mode
│   ├── js/
│   │   ├── actions/              # Auto-generated Wayfinder actions (TypeScript)
│   │   ├── components/
│   │   │   ├── ui/               # 26 shadcn-style primitives (button, card, dialog, sidebar, etc.)
│   │   │   ├── *.tsx             # Custom components (app-shell, nav-main, passkey-verify, etc.)
│   │   ├── hooks/                # useAppearance, useFlashToast, useClipboard, etc.
│   │   ├── layouts/
│   │   │   ├── app-layout.tsx    # Main authenticated layout wrapper
│   │   │   ├── auth-layout.tsx   # Auth pages layout wrapper
│   │   │   ├── app/              # Variants: app-sidebar-layout, app-header-layout
│   │   │   ├── auth/             # Variants: auth-card-layout, auth-simple-layout, auth-split-layout
│   │   │   └── settings/         # Settings sidebar layout
│   │   ├── lib/
│   │   │   └── utils.ts          # cn() (clsx + tailwind-merge), toUrl()
│   │   ├── pages/
│   │   │   ├── auth/             # login, register, forgot-password, reset-password, etc.
│   │   │   ├── settings/         # profile, security, appearance
│   │   │   ├── dashboard.tsx     # Dashboard page
│   │   │   └── welcome.tsx       # Landing page
│   │   ├── routes/               # Auto-generated route functions (Wayfinder)
│   │   ├── types/                # TypeScript type definitions
│   │   ├── wayfinder/            # Wayfinder core utilities
│   │   └── app.tsx               # Inertia app bootstrap + layout resolution
│   └── views/
│       └── app.blade.php         # Root Blade template (light/dark detection, Vite, SSR)
├── routes/
│   ├── web.php                   # Home, Dashboard, includes settings.php
│   ├── settings.php              # Profile, Security, Appearance, Passkey well-known
│   └── console.php               # Inspire command placeholder
├── tests/
│   ├── Feature/
│   │   ├── Auth/                 # 7 test files covering all auth flows
│   │   ├── Settings/             # ProfileUpdate, Security tests
│   │   ├── DashboardTest.php
│   │   └── ExampleTest.php
│   ├── Unit/
│   │   └── ExampleTest.php
│   ├── Pest.php                  # RefreshDatabase on Feature tests
│   └── TestCase.php              # Base case with skipUnlessFortifyHas helper
├── .env                          # SQLite default, DB session/cache/queue
├── composer.json
├── package.json
├── vite.config.ts
├── tsconfig.json
├── pint.json
├── phpstan.neon
└── eslint.config.js
```

---

## 🔄 Data Flow

```
Browser (React) 
    ↕ Inertia.js (XHR + JSON)
Laravel (Controllers)
    ↕ FormRequest (validation)
    ↕ Action classes (business logic)
    ↕ Eloquent Models (database)
    ↕ Inertia::render() → React page + props
    ↕ Wayfinder (type-safe route URLs)
```

1. **User interacts** with a React component (form click, link, etc.)
2. **Inertia sends** an XHR request to Laravel with the route + data
3. **Laravel middleware** processes the request (auth, verified, throttle, etc.)
4. **FormRequest** validates input
5. **Controller** calls an Action class (or Fortify for auth) to execute business logic
6. **Data** flows back to the frontend via `Inertia::render()` props
7. **Inertia** merges props and re-renders the React page without a full reload

---

## 🧩 Inertia Routing

Layout resolution happens in `resources/js/app.tsx`:

| Page Component | Layout |
|---------------|--------|
| `welcome` | No layout (null) |
| `auth/*` | `AuthLayout` → `AuthSimpleLayout` |
| `settings/*` | `AppLayout` → `AppSidebarLayout` + `SettingsLayout` |
| Everything else | `AppLayout` → `AppSidebarLayout` |

### Layout Hierarchy

```
TooltipProvider (Radix)
└── Toaster (Sonner)
    └── resolveLayout(page)
         ├── welcome → null
         ├── auth/* → AuthSimpleLayout
         │    ├── AuthHeader / AuthFooter
         │    └── {page content}
         ├── settings/* → AppSidebarLayout
         │    ├── AppHeader
         │    ├── Sidebar (Dashboard nav)
         │    └── SettingsLayout (Profile/Security/Appearance tabs)
         │         └── {page content}
         └── default → AppSidebarLayout
              ├── AppHeader
              ├── Sidebar (Dashboard nav)
              └── {page content}
```

---

## 🗄️ State Management

### Server State (via Inertia)
- **Auth state** — Shared globally via `HandleInertiaRequests@share`: `auth.user`, `appName`
- **Page props** — Passed per-page via `Inertia::render('page', { props })`
- **Flash messages** — Toast notifications via `useFlashToast` hook reading Inertia flash data
- **Deferred props** — Use `Inertia::defer()` for lazy-loaded data (skeleton loading states required)

### Client State
- **Theme** — `useAppearance` hook: persisted to localStorage + cookie (for SSR)
- **Sidebar** — `sidebar_state` cookie: open/closed toggle
- **Clipboard** — `useClipboard` hook for copy-to-clipboard
- **Mobile navigation** — `useMobileNavigation` for responsive sidebar behavior
- **Two-factor setup** — `useTwoFactorAuth` hook for 2FA enrollment flow

### No Global State Library Yet
The project currently uses React context + hooks for state. For complex reservation flows, consider Zustand or TanStack Query.

---

## 🧠 Key Backend Architecture Patterns

### Thin Controllers
Controllers only handle HTTP concerns (request → response). Business logic goes in:
- **Actions** (`app/Actions/`) — Single-responsibility classes with `__invoke()` or named methods
- **FormRequests** (`app/Http/Requests/`) — All validation and authorization
- **Policies** (`app/Policies/`) — Authorization logic (not yet created)

### Fortify-Driven Auth
Fortify handles all auth routes. The app only customizes:
- **Actions** — `CreateNewUser`, `ResetUserPassword`
- **Views** — Inertia page components registered in `FortifyServiceProvider`
- **Rate limiting** — Login, 2FA, passkeys limiters in `FortifyServiceProvider`

### Database Schema
Current tables: `users`, `password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `passkeys`

---

## 🚀 Planned Domain Architecture

When adding business logic (vehicles, reservations, clients, payments), follow this pattern:

```
app/
├── Actions/
│   ├── Fortify/              # Auth actions
│   ├── Vehicles/             # CreateVehicleAction, UpdateVehicleAction, etc.
│   └── Reservations/         # CreateReservationAction, CancelReservationAction, etc.
├── Data/                     # spatie/laravel-data DTOs (VehicleData, ReservationData)
├── Enums/                    # ReservationStatus, VehicleType, PaymentMethod
├── Events/                   # ReservationConfirmed, PaymentReceived
├── Listeners/                # SendReservationConfirmation, UpdateVehicleAvailability
├── Jobs/                     # ProcessPayment, SendReminderEmail
├── Mail/                     # ReservationConfirmation, PaymentReceipt
├── Notifications/            # BookingReminder, CancellationNotice
├── Policies/                 # VehiclePolicy, ReservationPolicy, PaymentPolicy
├── Rules/                    # Custom validation rules (AvailableDate, ValidLicense)
└── Http/
    ├── Controllers/
    │   ├── Admin/            # Admin CRUD controllers
    │   └── Api/              # API controllers (if needed)
    └── Requests/
        ├── Vehicles/         # StoreVehicleRequest, UpdateVehicleRequest
        └── Reservations/     # StoreReservationRequest, CancelReservationRequest
```