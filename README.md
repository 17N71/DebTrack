# DebTrack – Loans & Debts Tracker

Single-user web app to track debts (I owe / owed to me), payments, and contacts. Built with Next.js (App Router), TypeScript, Prisma, and Neon PostgreSQL.

## Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and set your Neon database URL:

   ```bash
   cp .env.example .env
   ```

   In `.env`:

   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
   ```

   Use the connection string from your [Neon](https://neon.tech) project (e.g. from the Neon MCP or dashboard).

3. **Database**

   The project uses Neon. Tables are already created if you used the Neon MCP; otherwise run:

   ```bash
   pnpm db:push
   ```

   Optional: seed the single user and sample data:

   ```bash
   pnpm db:seed
   # With sample contact + debt:
   SEED_SAMPLE=true pnpm db:seed
   ```

4. **Run the app**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You’re redirected to `/dashboard`.

## Pages

- **/dashboard** – Summary: total I owe, owed to me, net balance, overdue count, upcoming due
- **/debts** – List (filter: I owe / owed to me, status, search, sort)
- **/debts/new** – Add debt (type, contact, amount, currency, dates, notes)
- **/debts/[id]** – Debt detail, repayment progress, payment history, “Add Payment” modal
- **/debts/[id]/edit** – Edit debt
- **/contacts** – List contacts (search)
- **/contacts/new** – Add contact
- **/contacts/[id]** – Contact detail and linked debts
- **/contacts/[id]/edit** – Edit contact
- **/reports** – Export debts and payments to CSV
- **/settings** – App settings (placeholder)

## Tech stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js server actions, Prisma
- **DB:** PostgreSQL (Neon)
- **Validation:** Zod + react-hook-form
- **Auth:** Single-user mode (no login); user ID is fixed for MVP

## Stitch design reference

UI is based on the Stitch “Add New Debt Entry Form” project. Design tokens: primary `#2563eb`, secondary `#22c55e`, Inter font. Local HTML references are in `stitch_add_new_debt_entry_form/`.

To fetch images/code from Stitch when the Stitch MCP is available:

1. Use Stitch MCP tools: `list_screens` (project ID `2181018228884842802`), then `get_screen` for each screen ID to get `screenshot.downloadUrl` and `htmlCode.downloadUrl`.
2. Download with: `curl -L -o image.png "<url>"` (and similarly for HTML).

## Project structure

```
src/
  app/
    (dashboard)/     # layout with sidebar
      dashboard/
      debts/         # list, new, [id], [id]/edit
      contacts/      # list, new, [id], [id]/edit
      reports/
      settings/
    actions/         # server actions (debts, payments, contacts, dashboard)
  lib/
    db.ts            # Prisma client
    auth.ts          # single-user id
    calculations.ts # remainingBalance, paidTotal, isOverdue
    validations/     # zod schemas
  components/
    app-sidebar.tsx
prisma/
  schema.prisma
  seed.ts
```

## Calculations

- **remainingBalance** = principalAmount − sum(payments.amount), min 0, rounded to 2 decimals.
- **paidTotal** = sum of payment amounts for the debt.
- **Overdue:** `dueDate < today` and `remainingBalance > 0` and `status === OPEN`.

Payments are validated (amount > 0). Creating a payment does not auto-close the debt; set status to CLOSED when done.
