# AutoReserveDemo — Security Guide

## 🔐 Authentication (Laravel Fortify)

Fortify handles all authentication routes. It is frontend-agnostic; all views are Inertia pages.

### Enabled Features (`config/fortify.php`)

| Feature | Status | Notes |
|---------|--------|-------|
| `registration` | ✅ Enabled | Via `CreateNewUser` action |
| `resetPasswords` | ✅ Enabled | Via `ResetUserPassword` action |
| `emailVerification` | ✅ Enabled | Required for dashboard access |
| `twoFactorAuthentication` | ✅ Enabled | TOTP with confirm + confirmPassword |
| `passkeys` | ✅ Enabled | WebAuthn with confirmPassword |

### Rate Limiters (`FortifyServiceProvider`)

| Limiter | Limit | Scope |
|---------|-------|-------|
| `login` | 5 requests/min | Email + IP |
| `two-factor` | 5 requests/min | Session login.id |
| `passkeys` | 10 requests/min | credential.id + IP |

---

## ✅ Validation Rules

### User Profile (`ProfileValidationRules` trait)

```php
'name' => ['required', 'string', 'max:255'],
'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,{userId}'],
```

### Passwords (`PasswordValidationRules` trait)

Current (dev default):
```php
'password' => ['required', 'string', Password::default(), 'confirmed'],
'current_password' => ['required', 'string', 'current_password'],
```

Production (set in `AppServiceProvider`):
```php
Password::min(12)
    ->mixedCase()
    ->letters()
    ->numbers()
    ->symbols()
    ->uncompromised();
```

### Password Update (`PasswordUpdateRequest`)
- `current_password` — Required, validated against user's current password
- `password` — Required, confirmed, follows password rules

### Profile Delete (`ProfileDeleteRequest`)
- `password` — Required, must match current password (confirm identity)

---

## 🔒 Authorization

### Middleware Stack by Route

| Route | Middleware | Notes |
|-------|-----------|-------|
| `/dashboard` | `auth`, `verified` | Requires login + email verification |
| `/settings/profile` | `auth` | Profile editing (email change triggers re-verification) |
| `/settings/profile` DELETE | `auth`, `verified` | Account deletion requires verified email |
| `/settings/security` | `auth`, `verified`, `password.confirm` | Requires recent password confirmation |
| `/settings/password` PUT | `auth`, `verified`, `throttle:6,1` | Password change throttled |
| `/settings/appearance` | `auth`, `verified` | Theme preferences |
| Auth routes (Fortify) | Varies | Built-in Fortify middleware |
| Passkey endpoints | Varies | Fortify + Passkey middleware |

### Password Confirmation
Security-sensitive actions (security settings) require re-entering the password via `password.confirm` middleware. The confirmation session expires after configurable time (default 8 hours, configured in `config/auth.php`).

### Verification
`verified` middleware ensures only email-verified users access dashboard and certain settings.

---

## 🛡️ Form Request Authorization

All settings FormRequests use `authorize()` returning `true` (access is controlled by route middleware):

```php
public function authorize(): bool
{
    return true; // Route middleware handles auth
}
```

When implementing new features, FormRequests should check specific policies:
```php
public function authorize(): bool
{
    return $this->user()->can('create', Reservation::class);
}
```

---

## 🧹 Input Sanitization

- **Email**: Lowercased before uniqueness check and storage
- **Password**: Hashed via Laravel's `Hash::make()` (bcrypt) — never stored in plaintext
- **Two-factor secrets**: Encrypted at rest via Eloquent casting (`encrypted` cast)
- **Recovery codes**: Encrypted at rest
- **XSS**: Inertia's React integration automatically escapes output — no need for manual escaping
- **SQL Injection**: Prevented by Eloquent's parameter binding — NEVER use raw SQL with user input

---

## 🥷 Two-Factor Authentication (TOTP)

### Flow
1. User enables 2FA in Security settings
2. QR code is shown (secret shared via `two_factor_secret`)
3. User confirms by entering a TOTP code from their authenticator app
4. `two_factor_confirmed_at` is set
5. On next login, user is prompted for TOTP code after password
6. Recovery codes can be used if authenticator is lost

### Configuration
- `twoFactorAuthentication` with `confirm: true` and `confirmPassword: true`
- Login with 2FA redirects to `/two-factor-challenge` (Inertia page)
- Two-factor challenge rate limited: 5/min per session

---

## 🔑 Passkeys (WebAuthn)

### Flow
1. User registers a passkey in Security settings (requires password confirmation)
2. Browser's native WebAuthn API creates a credential (TouchID, FaceID, Windows Hello, etc.)
3. Credential is stored in `passkeys` table
4. On login, user can authenticate with passkey directly (no password needed)

### Security Notes
- Passkey credentials are stored as JSON in the `credential` column (encrypted at rest)
- `credential_id` is unique across all users
- `last_used_at` tracks usage for auditing
- Rate limited: 10 requests/min per credential + IP

---

## 🍪 Cookie Security

| Cookie | Encrypted? | Purpose |
|--------|-----------|---------|
| `appearance` | ❌ No | Theme preference (light/dark/system) |
| `sidebar_state` | ❌ No | Sidebar collapse state |
| Session cookie | ✅ Yes | Laravel session |
| `XSRF-TOKEN` | ✅ Yes | CSRF protection |

Non-encrypted cookies are excluded in `bootstrap/app.php`:
```php
$middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
```

---

## 🚦 Production Security (AppServiceProvider)

```php
// In production
public function boot(): void
{
    // Prevent destructive DB commands
    DB::prohibitDestructiveCommands($this->app->isProduction());

    // Strong password requirements
    Password::defaults(function () {
        return Password::min(12)
            ->mixedCase()
            ->letters()
            ->numbers()
            ->symbols()
            ->uncompromised();
    });
}
```

---

## 📋 Security Checklist for New Features

- [ ] Add validation rules to FormRequest (never inline in controller)
- [ ] Add policy class for the model
- [ ] Register policy in `AuthServiceProvider` (if created)
- [ ] Use route middleware (`auth`, `verified`, `password.confirm` as needed)
- [ ] Apply rate limiting for sensitive endpoints
- [ ] Ensure sensitive data is cast as `encrypted` or `hashed` in Eloquent
- [ ] Never expose secrets, keys, or recovery codes in responses unless necessary
- [ ] Use `current_password` rule for destructive operations
- [ ] Test: authenticated user, unauthenticated user, and wrong-role scenarios