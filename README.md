# Inventory Manager (React + TypeScript + Ant Design)

## Run in VS Code
1. Install Node.js 18+
2. Open this folder in VS Code
3. In the terminal: `npm install` then `npm run dev`
4. Open http://localhost:5173

## Supabase setup
1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project's API settings. These are browser-safe project values; never put a `service_role` key in this app.
3. Run `supabase/migrations/20261112000000_account_products.sql` in the Supabase SQL Editor, or apply it with the Supabase CLI.
4. In Supabase Auth settings, configure the site URL and allowed redirect URLs for this app, and enable email confirmations.
5. Restart the Vite dev server after changing `.env.local`.

To send a six-digit verification code, edit the Supabase Auth **Confirm signup** email template to include `{{ .Token }}` (for example: `Your verification code is {{ .Token }}`). The sign-up screen accepts that code and verifies it with Supabase. Configure a custom SMTP provider in Supabase for dependable delivery to real Gmail inboxes; never put SMTP credentials in this app. Existing browser-local accounts and saved products are not migrated.

The app uses Supabase Auth and stores each user's inventory as JSON in `public.account_products`. The `get_my_products` and `save_my_products` RPC functions use the signed-in user's ID, and row-level security prevents access to other users' inventory.

## Structure
- `src/App.tsx` – app state and screen routing
- `src/types.ts` – shared types
- `src/data/products.ts` – starting data
- `src/data/accountProducts.ts` – Supabase inventory reads and writes
- `supabase/migrations/` – database table, RLS policies, and RPC functions
- `src/utils.ts` – peso format and stock status helpers
- `src/components/` – reusable pieces (PhoneFrame, ScreenHeader, BottomNav, ProductRow, ...)
- `src/screens/` – one file per screen
