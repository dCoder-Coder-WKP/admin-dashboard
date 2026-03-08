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
- **Server Actions**: All mutations (Create, Read, Update, Delete) are handled via Next.js Server Actions (`actions.ts` files within each route domain). 
- **Cache Invalidation**: Upon successful mutation, `revalidatePath` and `revalidateTag('menu')` ensure that any cached responses matching the tag are instantly purged.
- **Optimistic/Inline UI**: Components like `InlinePrice` (and its variants for toppings/extras) manage their own localized loading/saved/error state visually to provide immediate feedback before the Server Action resolves.
- **Modal Forms**: Complex entities like Toppings, Extras, and Notifications utilize reusable Modal components powered by standard React state and styled with Tailwind.

### Active Data Entities (Full CRUD Supported)
- **Pizzas**: Creation, Updates (including price and topping relations), Deletion, Activation Toggle.
- **Toppings & Extras**: Full property management, inline price edits, and sold-out toggles.
- **Categories**: Drag-and-drop or manual sort ordering management for pizza/extra classification.
- **Orders**: Live Kanban board with drag-and-drop status updates + History view for completed/cancelled orders.
- **Site Config**: Real-time management of global app constants (keys, values, boolean toggles).
- **Notifications (Signals)**: Broadcast global alerts with expiration and pinning support.

### $10M Scale-Up Features (Mock/Visual only)
All of these features are beautifully animated but operate strictly on mock data. They are prominently marked with a `PLACEHOLDER / DEMO` badge within the UI to avoid confusion.
- **IoT Quality War Room**: Real-time mock telemetry from dough fermentation fridges and pizza ovens.
- **Silent Fleet Tracker**: Monitor the Aldona e-bike fleet for location and noise acoustic impact.
- **Sentiment AI**: Analyze customer satisfaction and product feedback through Natural Language Processing.

## Developer & Engineer Guide

### Prerequisites
- Node.js 22+ (Required for proper Vitest ESM support)
- Shared Supabase Project

### Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_EMAIL=eilliw.willie@gmail.com
```

### Initial Setup Credentials
The application is pre-configured to use the following credentials for logging into the admin dashboard:
- **Email**: `eilliw.willie@gmail.com`
- **Password**: `Wekne@dp1zza!`

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
