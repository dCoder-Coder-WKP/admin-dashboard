# We Knead Pizza - Admin Dashboard

> Dedicated operations control panel for managing menu items, pricing, and dynamic notifications.

## System Architecture

The Admin Dashboard is a Next.js 15 (App Router) application independent of the main website. It acts as the secure write-interface for the shared Supabase PostgreSQL database.

### Security Model
1. **Authentication**: Handled via `@supabase/auth-helpers-nextjs`. Access is gated at the edge using Next.js Middleware (`src/middleware.ts`), verifying active session tokens.
2. **Authorization**: Hardcoded ownership validation. The system verifies that the authenticated user matches the `ADMIN_EMAIL` environment variable, preventing unauthorized account enumeration or signups from accessing the dashboard.
3. **Database Communication**: 
   - Operations that bypass RLS (like creating new pizzas) use the Supabase Service Role key securely hidden in Server Actions (`lib/supabaseAdmin.ts`).
   - The Service Role key must NEVER be exposed to the client bundle.

### Design Pattern
- **Server Actions**: All mutations (Updates, Creates, Deletes) are handled via Next.js Server Actions (e.g., `app/dashboard/pizzas/actions.ts`). 
- **Cache Invalidation**: Upon successful mutation, `revalidateTag('menu')` ensures that any cached responses matching the tag are instantly purged.
- **Optimistic UI**: Components like `InlinePrice` manage their own localized loading/saved/error state visually to provide immediate feedback before the Server Action resolves.

## Developer & Engineer Guide

### Prerequisites
- Node.js 18.17+
- Shared Supabase Project

### Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_EMAIL=willie.fernandes@wekneadpizza.com
```

### Local Development
```bash
npm install
npm run dev
```

### Adding New Entity Management
If you need to add management for a new database entity (e.g., `orders`):
  1. Add navigation link to `app/dashboard/layout.tsx`.
  2. Create a folder `app/dashboard/orders`.
  3. Create `page.tsx` as a Server Component to fetch and display the grid.
  4. Create `actions.ts` for mutations using `supabaseAdmin`.
  5. Use `react-hook-form` + `zod` bindings in `lib/validations.ts` for any creation forms.

### Testing
Unit tests are implemented using Vitest and React Testing Library.
```bash
npm run test
```
