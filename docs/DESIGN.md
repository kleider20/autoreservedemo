# AutoReserveDemo — Design System & UI/UX Patterns

## 🎯 Core Design Principles

1. **Clarity first** — Every UI element must have a clear purpose. Avoid visual noise.
2. **Progressive disclosure** — Show advanced options only when needed. Use modals for complex flows.
3. **Consistent feedback** — Every action provides immediate feedback (toast, loading state, animation).
4. **Mobile-first responsive** — All layouts work from 320px to ultrawide. Sidebar collapses to sheet on mobile.
5. **Accessibility** — Semantic HTML, keyboard navigation, focus management, ARIA labels where needed.

---

## 🧩 Page Layout Variants

### Authentication Layouts

Located in `resources/js/layouts/auth/`:

| Variant | File | Use Case | Structure |
|---------|------|----------|-----------|
| **Simple** | `auth-simple-layout.tsx` | Default auth pages | Centered card, minimal |
| **Card** | `auth-card-layout.tsx` | Alternative style | Framed card with shadow |
| **Split** | `auth-split-layout.tsx` | Marketing-oriented | Image half + form half |

The active variant is selected in `app.tsx` via `resolveLayout()`.

### App Layouts

Located in `resources/js/layouts/app/`:

| Variant | File | Use Case | Structure |
|---------|------|----------|-----------|
| **Sidebar** | `app-sidebar-layout.tsx` | Dashboard default | Sidebar nav + header + content |
| **Header** | `app-header-layout.tsx` | Minimal/reader views | Top nav only, no sidebar |

### Settings Layout

`resources/js/layouts/settings/layout.tsx` — Nested inside AppLayout. Provides:
- Left sidebar with section links (Profile, Security, Appearance)
- Active link highlighting based on current URL
- Responsive: sidebar becomes top tabs on mobile

---

## 🧱 Key UI Patterns

### Dashboard Widgets
- Use Card components with consistent padding (`p-6`)
- Icons in 32x32 with muted background circle
- Value prominently displayed (text-2xl font-semibold)
- Trend indicators with text-xs colored UP/DOWN
- Group widgets in responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

### Forms
- Labels above inputs (not placeholder-only)
- Inputs: full width, consistent height (`h-9`), focus ring styling
- Error states: red border + `InputError` component below field
- Submit buttons: right-aligned or full-width on mobile
- Inline validation on blur where possible
- Use `preserveScroll: true` on Inertia form submissions

### Data Tables
- Responsive: horizontal scroll on mobile, card view on very small screens
- Sortable column headers (click to sort)
- Pagination at bottom
- Action column with dropdown menu (Edit, Delete, etc.)
- Empty state: illustration + message + CTA button

### Modals (Dialogs)
- Trigger: Button or link
- Content: centered, max-w-lg, close on X + Escape + backdrop click
- Header: Title + Description
- Footer: Cancel + Confirm buttons (destructive in red)
- Loading state on confirm button during submission

### Navigation
- Sidebar: collapsible, section groups with labels
- Breadcrumbs: `Home > Section > Page` pattern
- Active state: highlighted nav item
- Mobile: sidebar becomes slide-over sheet

---

## 🎭 Micro-interactions & Animations

### Page Transitions
- Inertia handles page transitions (no full reloads)
- Future: add `preserveState` for form persistence

### Loading States
- Buttons: show spinner icon + `disabled` during submission
- Deferred props: show skeleton cards (pulse animation)
- Tables: skeleton rows on initial load (3-5 shimmer rows)

### Toast Notifications (Sonner)
- Success: green accent, auto-dismiss 4s
- Error: red accent, auto-dismiss 6s
- Warning: yellow/amber accent, auto-dismiss 5s
- Info: blue accent, auto-dismiss 4s

### Hover/Active States
- Buttons: scale(1.02) on hover, scale(0.98) on active
- Cards: subtle shadow lift on hover (`hover:shadow-md transition-shadow`)
- Links: underline decoration on hover
- List items: background color change on hover

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Behavior |
|-----------|-------|----------|
| `sm` | 640px | Sidebar hidden, hamburger menu visible |
| `md` | 768px | Two-column grids start |
| `lg` | 1024px | Sidebar visible, three-column grids |
| `xl` | 1280px | Max-width containers, full layout |
| `2xl` | 1536px | Ultrawide optimization |

### Mobile Adaptations
- Sidebar → bottom sheet / slide-over drawer
- Tables → stacked card layout
- Multi-column → single column
- Top nav → hamburger + dropdown
- Font sizes: maintain minimum 16px on inputs (prevent iOS zoom)

---

## 🖼️ Image & Media Guidelines

- Vehicle images: 16:9 aspect ratio, WebP format (with JPEG fallback)
- Avatar: 40x40px default, 32x32px in sidebar, 80x80px in profile
- Icons: 16px inline text, 20px buttons, 24px nav items, 32px feature highlights
- Use `loading="lazy"` for below-fold images
- Use `<picture>` for responsive image sets

---

## 🎨 Empty States

Every list/data view must handle the empty state:

```
[Icon 64x64 muted]
[Title: "No reservations yet"]
[Description: "Start by creating your first vehicle reservation."]
[CTA Button: "Create Reservation"]
```

---

## ♿ Accessibility Requirements

- All interactive elements must be keyboard accessible (Tab, Enter, Escape)
- Form inputs need associated labels (use `<Label>` component)
- Color is NEVER the only indicator of state (add icons/text)
- Focus indicators: visible focus ring (`ring-2 ring-ring ring-offset-2`)
- Screen reader: `sr-only` for decorative icons, `aria-label` for icon-only buttons
- Modals: trap focus, return focus to trigger on close
- Error messages: connected to input via `aria-describedby`