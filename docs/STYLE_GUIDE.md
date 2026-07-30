# AutoReserveDemo — Style Guide

## 🎨 Design System Overview

This project uses **Tailwind CSS v4** with the `@theme` directive for design tokens. All colors use the **OKLCH** color space for perceptual uniformity. Dark mode is implemented via `.dark` class variant.

---

## 🅰️ Typography

### Font Family
```css
--font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
```

### Font Sizes
Use Tailwind utility classes only:
- `text-xs` (0.75rem), `text-sm` (0.875rem), `text-base` (1rem)
- `text-lg` (1.125rem), `text-xl` (1.25rem), `text-2xl` (1.5rem)
- `text-3xl` (1.875rem), `text-4xl` (2.25rem)

### Font Weights
- `font-normal` (400), `font-medium` (500), `font-semibold` (600)

---

## 🎨 Color System (OKLCH)

### Light Mode (`:root`)

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(1 0 0)` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | Body text |
| `--card` | `oklch(1 0 0)` | Card background |
| `--card-foreground` | `oklch(0.145 0 0)` | Card text |
| `--primary` | `oklch(0.205 0 0)` | Primary buttons, active states |
| `--primary-foreground` | `oklch(0.985 0 0)` | Text on primary |
| `--secondary` | `oklch(0.97 0 0)` | Secondary buttons, subtle bg |
| `--secondary-foreground` | `oklch(0.205 0 0)` | Text on secondary |
| `--muted` | `oklch(0.97 0 0)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | Muted text (subtle) |
| `--accent` | `oklch(0.97 0 0)` | Accent hover states |
| `--accent-foreground` | `oklch(0.205 0 0)` | Text on accent |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Delete/danger actions |
| `--destructive-foreground` | `oklch(0.577 0.245 27.325)` | Text on destructive |
| `--border` | `oklch(0.922 0 0)` | Borders, dividers |
| `--input` | `oklch(0.922 0 0)` | Input borders |
| `--ring` | `oklch(0.145 0 0)` | Focus ring |
| `--radius` | `0.625rem` | Default border radius |
| `--chart-1` through `--chart-5` | Various OKLCH | Chart colors |

### Dark Mode (`.dark`)

| Token | Dark Value |
|-------|-----------|
| `--background` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.985 0 0)` |
| `--card` | `oklch(0.145 0 0)` |
| `--card-foreground` | `oklch(0.985 0 0)` |
| `--primary` | `oklch(0.985 0 0)` |
| `--primary-foreground` | `oklch(0.205 0 0)` |
| `--secondary` | `oklch(0.269 0 0)` |
| `--secondary-foreground` | `oklch(0.985 0 0)` |
| `--muted` | `oklch(0.269 0 0)` |
| `--muted-foreground` | `oklch(0.708 0 0)` |
| `--accent` | `oklch(0.269 0 0)` |
| `--accent-foreground` | `oklch(0.985 0 0)` |
| `--destructive` | `oklch(0.396 0.141 25.723)` |
| `--destructive-foreground` | `oklch(0.637 0.237 25.331)` |
| `--border` | `oklch(0.269 0 0)` |
| `--input` | `oklch(0.269 0 0)` |
| `--ring` | `oklch(0.439 0 0)` |

### Sidebar Colors (Light/Dark)

| Token | Light | Dark |
|-------|-------|------|
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264.376)` |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--sidebar-accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-border` | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` |
| `--sidebar-ring` | `oklch(0.145 0 0)` | `oklch(0.439 0 0)` |

### Usage Rules
- **NEVER** hardcode hex, RGB, or OKLCH values in components
- Always use CSS variable references via Tailwind: `bg-background`, `text-foreground`, `border-border`
- Use semantic color classes: `text-muted-foreground` for secondary text, `text-destructive` for errors

---

## 📐 Spacing & Sizing

Use Tailwind's default spacing scale:
- `p-4` (1rem = 16px), `px-6` (1.5rem), `gap-2` (0.5rem)
- `space-y-4`, `space-x-2` for flex/grid gaps
- `max-w-7xl` for page containers, `mx-auto` for centering

---

## 🧱 Component Variants

### Buttons
- `variant="default"` — Primary action (bg-primary)
- `variant="secondary"` — Secondary action (bg-secondary)
- `variant="destructive"` — Dangerous action (bg-destructive)
- `variant="outline"` — Outlined (border)
- `variant="ghost"` — Minimal (hover bg)
- `variant="link"` — Link-style (text only)
- `size="default"` (h-9 px-4 py-2), `size="sm"` (h-8 rounded-md px-3 text-xs), `size="lg"` (h-10 rounded-md px-8), `size="icon"` (h-9 w-9)

### Cards
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- Used for settings sections, dashboard widgets, auth forms

### Forms
- `Form` from Inertia with wayfinder action functions
- `Input` with `InputOTP` variant for 2FA codes
- `Label`, `Textarea`, `Select` from shadcn/ui
- `PasswordInput` for password fields with toggle visibility

### Dialog/Modal
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`
- Used for: 2FA setup, passkey registration, delete confirmation

### Sidebar
- `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`
- `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`
- `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`
- `SidebarRail` — collapsed state trigger

---

## 🎭 Dark Mode Implementation

Applied via:
1. CSS `.dark` variant: `@custom-variant dark (&:is(.dark *));`
2. JavaScript toggle: `document.documentElement.classList.toggle('dark')`
3. Persisted in: localStorage + `appearance` cookie (for SSR)
4. Cookie is NOT encrypted (excluded in `bootstrap/app.php`)
5. Hook: `use-appearance.tsx` manages state, transitions, and persistence

### Appearance Options
- `light` — Always light mode
- `dark` — Always dark mode
- `system` — Follows OS preference via `prefers-color-scheme` media query

---

## 🧩 Tailwind v4 Specific Rules

1. Use `@theme` for custom tokens — NOT `theme.extend` in config
2. Use `@custom-variant` for custom variants — NOT `variants` in config
3. Use `@import 'tailwindcss'` — NOT `@tailwind base/components/utilities`
4. Use `@source` to tell Tailwind where to scan for class usage
5. Animations: Use `tw-animate-css` plugin via `@import 'tw-animate-css'`
6. NEVER create custom CSS classes for spacing, colors, or typography — use Tailwind utilities

---

## ✅ Code Quality Conventions

- ESLint 10 with React Hooks plugin + React Compiler plugin
- Prettier 3 for formatting (`npm run format`)
- TypeScript strict mode (no `any` unless absolutely necessary)
- PHP files: Run `vendor/bin/pint --format agent` after every change
- TSX files: Run `npm run lint && npm run types:check` before committing