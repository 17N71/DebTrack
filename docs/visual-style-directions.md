# DebTrack – 3 Visual Style Directions

Practical palettes and typography for implementation.

---

## 1) Minimal monochrome + single accent

- **Palette (HEX):**
  - Background: `#ffffff` / dark `#0a0a0a`
  - Surface: `#f5f5f5` / dark `#171717`
  - Text: `#0a0a0a` / dark `#fafafa`
  - Muted: `#737373` / dark `#a3a3a3`
  - Accent (only color): `#0f766e` (teal)
- **Typography:** Inter or **DM Sans** (Google Fonts). Weights 400, 500, 600.
- **Cards/buttons:** Flat, 1px border (`#e5e5e5` / dark `#262626`). Buttons: solid accent, no shadow. Border radius 6–8px.
- **Icons:** Outlined, 20–24px, same weight as body. Single accent for primary actions.
- **Dashboard:** One column of stats; simple table for debts; no gradients or imagery.

---

## 2) Warm friendly personal finance

- **Palette (HEX):**
  - Background: `#fefce8` (warm cream) / dark `#1c1917`
  - Surface: `#fffbeb` / dark `#292524`
  - Primary: `#2563eb` (blue)
  - Secondary: `#22c55e` (green)
  - Warm gray text: `#44403c` / dark `#e7e5e4`
- **Typography:** **Inter** or **Nunito** (Google Fonts). Rounded, approachable. Weights 400, 600, 700.
- **Cards/buttons:** Soft shadows, 12–16px radius. Primary buttons with light shadow (`shadow-primary/20`). Slight hover scale or brightness.
- **Icons:** Rounded Material Icons or similar. Blue for “I owe”, green for “owed to me”.
- **Dashboard:** Card grid (e.g. 3 columns), short welcome line, clear labels (“I Owe”, “Owed to Me”, “Net Balance”).

---

## 3) Dark pro / developer style

- **Palette (HEX):**
  - Background: `#0f172a` (slate)
  - Surface: `#1e293b` / `#334155`
  - Border: `#334155` / `#475569`
  - Primary: `#38bdf8` (sky)
  - Success: `#4ade80` (green)
  - Muted text: `#94a3b8`
- **Typography:** **JetBrains Mono** for numbers/codes, **Inter** or **Geist** for UI. Monospace for amounts/IDs.
- **Cards/buttons:** Dark surfaces, subtle borders. Buttons: outline or low-contrast fill. Accent for primary action only. Border radius 6–8px.
- **Icons:** Outlined, consistent stroke. Muted by default, accent on hover/active.
- **Dashboard:** Dense stats row; compact table; optional code-like IDs (e.g. `#DT-4829`).

---

## Current implementation

The app currently follows **direction 2 (warm friendly)** with Inter, primary `#2563eb`, secondary `#22c55e`, and Tailwind theme variables in `globals.css`. To switch:

1. Change `@theme` in `src/app/globals.css` (and any hardcoded hex).
2. Swap font link in `src/app/layout.tsx` if using a different Google Font.
3. Tweak `app-sidebar` and dashboard cards (e.g. remove gradient for direction 1, or darken for direction 3).
