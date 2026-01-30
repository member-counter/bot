# Remaining Next.js Imports to Fix

This document tracks files that still have Next.js imports. Priority is given to files actively used by converted pages.

## ✅ Fixed Files (Critical Path)

### Navigation & Layout

- ✅ `src/components/Layout.tsx` - Kept `next/font/google` (works in Vite)
- ✅ `src/app/components/NavBar.tsx` - Fixed to use React Router
- ✅ `src/app/components/LandingPage/index.tsx` - Fixed to use React Router
- ✅ `src/app/components/ProgressBarProvider.tsx` - Disabled next-nprogress-bar
- ✅ `src/i18n/client.tsx` - Removed Next.js Head and dynamic

### Dashboard Components

- ✅ `src/app/dashboard/servers/[guildId]/ServerNavMenu/ChannelNavItem.tsx` - Fixed
- ✅ `src/app/dashboard/servers/[guildId]/ServerNavMenu/ServerNavMenu.tsx` - Fixed

## ⚠️ Remaining Files (Medium Priority)

These files are used by dashboard/admin features and should be fixed:

### Dashboard Components (using `useParams` or `usePathname`)

- [ ] `src/app/dashboard/servers/[guildId]/ChannelMaps.ts` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/TemplateEditor/DataSource/Options/Pages/ChannelsOptions.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/[channelId]/sections/MissingPermissionsWarning.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/layoutInner.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/InviteBotBanner.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/BlockedBanner.tsx` - useParams, useRouter
- [ ] `src/app/dashboard/servers/[guildId]/ForbiddenPage.tsx` - useRouter
- [ ] `src/app/dashboard/servers/[guildId]/InviteBotPage.tsx` - useRouter, Link
- [ ] `src/app/dashboard/servers/[guildId]/UserPermissionsContext.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/TemplateEditor/TemplateEditor.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/TemplateEditor/Mention/MentionElement.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/TemplateEditor/Mention/MentionSuggestions.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/TemplateEditor/DataSource/Options/Pages/MembersOptions/FilterByConnectedTo.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/TemplateEditor/DataSource/Options/Pages/MembersOptions/FilterByRole.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/[channelId]/sections/EditTemplate.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/[channelId]/sections/EnableTemplate.tsx` - useParams
- [ ] `src/app/dashboard/servers/[guildId]/[channelId]/sections/TemplateError.tsx` - useParams

### Admin Components

- [ ] `src/app/error.tsx` - Link
- [ ] `src/app/admin/donations/Donation.tsx` - Link

### Other Components

- [ ] `src/app/dashboard/layout.tsx` - usePathname
- [ ] `src/app/components/Combobox/items/ChannelItem.tsx` - useParams
- [ ] `src/app/components/Combobox/items/RoleItem.tsx` - useParams

### Images

## 📝 Low Priority (Can Be Fixed Later)

These files are old Next.js pages that will be deleted anyway:

### Old Page Files (to be deleted)

- [ ] `src/app/support/page.tsx`
- [ ] `src/app/legal/[oldSlug]/page.tsx`
- [ ] `src/app/login/page.tsx`
- [ ] `src/app/logout/page.tsx`
- [ ] `src/app/premium/page.tsx`
- [ ] `src/app/dashboard/servers/[guildId]/settings/page.tsx`
- [ ] `src/app/docs/page.tsx`
- [ ] `src/app/donate/page.tsx`
- [ ] `src/app/invite/page.tsx`
- [ ] `src/app/dashboard/servers/[guildId]/[channelId]/page.tsx`
- [ ] `src/app/dashboard/servers/[guildId]/page.tsx`
- [ ] `src/app/dashboard/page.tsx`
- [ ] `src/app/account/page.tsx`
- [ ] `src/app/admin/donations/page.tsx`

### Old API Routes (to be deleted)

- [ ] `src/app/api/auth/callback/route.ts`
- [ ] `src/app/api/auth/logout/route.ts`
- [ ] `src/app/api/auth/route.ts`

### Server-side i18n (to be deleted)

- [ ] `src/i18n/server.ts`

### Hooks

- [ ] `src/hooks/useInterceptAppRouter.ts` - Check if still needed

## 🔧 Fix Pattern

For most files, the fix pattern is:

```typescript
// Before



// After
import { Link, useLocation, useNavigate, useParams } from "react-router";

// Then update usage:
const pathname = usePathname(); → const { pathname } = useLocation();
const router = useRouter(); router.push(...) → const navigate = useNavigate(); navigate(...)
<Link href="..."> → <Link to="...">
prefetch={true} → (remove, not needed)
```

```typescript
// Before

<Image src="..." alt="..." width={100} height={100} />

// After
<img src="..." alt="..." width={100} height={100} />
```

## 📊 Progress

- **Fixed**: 7 critical files
- **Medium Priority Remaining**: ~25 files
- **Low Priority**: ~17 files (will be deleted)
- **Total Remaining**: ~42 files

**Note**: Many of the remaining files will be deleted as part of the cleanup, so we don't need to fix all of them.
