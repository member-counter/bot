# Next.js to Vite Migration - Cleanup Checklist

This document lists all Next.js specific files and directories that should be deleted or cleaned up after the migration is complete and tested.

## ✅ Files/Directories Safe to Delete

### Next.js Configuration

- [ ] `apps/website/next.config.js` - Next.js configuration (replaced by vite.config.ts)

### Old API Routes (moved to apps/server)

- [ ] `apps/website/src/app/api/` - All API routes moved to Express backend
  - `src/app/api/auth/` - OAuth routes
  - `src/app/api/trpc/` - tRPC endpoint
  - `src/app/api/sessionCookie.ts` - Session management
  - `src/app/api/catchErrors.ts` - Error handling

### Old tRPC Server Code (moved to packages/trpc-api)

- [ ] `apps/website/src/server/` - Server-side code moved to shared package
  - `src/server/api/` - tRPC routers
  - `src/server/auth.ts` - Auth logic

### Server-Side tRPC Caller

- [ ] `apps/website/src/trpc/server.ts` - RSC tRPC caller (not needed in SPA)

### Old Next.js Pages (converted to React Router)

- [ ] `apps/website/src/app/page.tsx` - Home page (keep, but can be moved to pages/)
- [ ] `apps/website/src/app/login/page.tsx` - Converted to pages/Login.tsx
- [ ] `apps/website/src/app/logout/page.tsx` - Converted to pages/Logout.tsx
- [ ] `apps/website/src/app/premium/page.tsx` - Converted to pages/Premium.tsx
- [ ] `apps/website/src/app/status/page.tsx` - Converted to pages/Status.tsx
- [ ] `apps/website/src/app/account/page.tsx` - Converted to pages/Account.tsx
- [ ] `apps/website/src/app/donors/page.tsx` - Converted to pages/Donors.tsx
- [ ] `apps/website/src/app/donate/page.tsx` - Converted to pages/Donate.tsx
- [ ] `apps/website/src/app/docs/page.tsx` - Converted to pages/Docs.tsx
- [ ] `apps/website/src/app/support/page.tsx` - Converted to pages/Support.tsx
- [ ] `apps/website/src/app/invite/page.tsx` - Converted to pages/Invite.tsx
- [ ] `apps/website/src/app/legal/page.tsx` - Converted to pages/Legal.tsx
- [ ] `apps/website/src/app/legal/[oldSlug]/page.tsx` - Converted to pages/LegalRedirect.tsx
- [ ] `apps/website/src/app/dashboard/page.tsx` - Converted to pages/dashboard/Dashboard.tsx
- [ ] `apps/website/src/app/dashboard/servers/[guildId]/page.tsx` - Converted to pages/dashboard/DashboardGuild.tsx
- [ ] `apps/website/src/app/dashboard/servers/[guildId]/settings/page.tsx` - Converted to pages/dashboard/DashboardGuildSettings.tsx
- [ ] `apps/website/src/app/dashboard/servers/[guildId]/[channelId]/page.tsx` - Converted to pages/dashboard/DashboardGuildChannel.tsx
- [ ] `apps/website/src/app/admin/users/page.tsx` - Converted to pages/admin/AdminUsers.tsx
- [ ] `apps/website/src/app/admin/users/[id]/page.tsx` - Converted to pages/admin/AdminUser.tsx
- [ ] `apps/website/src/app/admin/guilds/page.tsx` - Converted to pages/admin/AdminGuilds.tsx
- [ ] `apps/website/src/app/admin/homepage/page.tsx` - Converted to pages/admin/AdminHomepage.tsx
- [ ] `apps/website/src/app/admin/homepage/demo-servers/[id]/page.tsx` - Converted to pages/admin/AdminDemoServer.tsx
- [ ] `apps/website/src/app/admin/donations/page.tsx` - Converted to pages/admin/AdminDonations.tsx
- [ ] `apps/website/src/app/admin/donations/[id]/page.tsx` - Converted to pages/admin/AdminDonation.tsx
- [ ] `apps/website/src/app/admin/donations/new/page.tsx` - Converted to pages/admin/AdminDonationNew.tsx

### Old Next.js Layouts (using server-side auth)

- [ ] `apps/website/src/app/admin/users/layout.tsx` - Used server-side auth (replaced by ProtectedRoute)
- [ ] `apps/website/src/app/admin/guilds/layout.tsx` - Used server-side auth (replaced by ProtectedRoute)
- [ ] `apps/website/src/app/admin/homepage/layout.tsx` - Used server-side auth (replaced by ProtectedRoute)
- [ ] `apps/website/src/app/admin/donations/layout.tsx` - Used server-side auth (replaced by ProtectedRoute)

### Server-Side i18n

- [ ] `apps/website/src/i18n/server.ts` - Server-side i18n (not needed in SPA)

## ⚠️ Files to Update (Not Delete)

### Remove Next.js imports

The following files still have imports from `next/*` that need to be updated or removed:

- [ ] `apps/website/src/components/Layout.tsx` - Uses `next/font/google` (can keep for now, or replace with CSS)
- [ ] `apps/website/src/hooks/useInterceptAppRouter.ts` - Check if still needed

### Update Package Dependencies

- [ ] `apps/website/package.json` - Remove `next-nprogress-bar` (already disabled in ProgressBarProvider)

## 📝 Keep These Files

### App Directory Components

Keep `apps/website/src/app/` directory for:

- Shared components (`src/app/components/`)
- Feature-specific components (`src/app/dashboard/`, `src/app/admin/`, etc.)
- Component logic and utilities

### Core Files

- `apps/website/src/app/layout.tsx` - Root layout (used by App.tsx)
- `apps/website/src/app/page.tsx` - Home page component
- `apps/website/src/app/error.tsx` - Error boundary
- All component files that aren't page.tsx or layout.tsx files

## 🧪 Testing Checklist

Before deleting any files, verify:

- [ ] All routes work in the browser
- [ ] Authentication flow works (login, logout, protected routes)
- [ ] Admin pages check permissions correctly
- [ ] Dashboard functionality works
- [ ] i18n language switching works
- [ ] Build completes successfully (`pnpm build`)
- [ ] Production preview works (`pnpm preview`)

## 🚀 After Cleanup

Once all files are deleted and tests pass:

1. Run `pnpm build` from root to verify builds work
2. Test the app thoroughly in development and production
3. Update deployment scripts if needed
4. Remove Next.js from dependencies entirely
5. Update documentation

---

**Note**: Do not delete anything until the migration is fully tested and working!
