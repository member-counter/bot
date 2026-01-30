# Next.js to React Router Conversion Guide

## Overview

This guide documents the patterns for converting Next.js pages to React Router v7 components.

## Conversion Patterns

### 1. Simple Redirect Page

**Example:** `logout/page.tsx`

**Before (Next.js):**

```tsx
import { routes } from "@mc/common/Routes";

export default function Page() {
  redirect(Routes.ApiLogout, RedirectType.push);
}
```

**After (React Router):**

```tsx
import { Navigate } from "react-router";

import { routes } from "@mc/common/Routes";

export default function LogoutPage() {
  return <Navigate to={Routes.ApiLogout} replace />;
}
```

**Changes:**

- ✅ Remove `redirect()` → Use `<Navigate>` component
- ✅ `replace` prop instead of `RedirectType.push`
- ✅ File moved to `src/pages/` directory

---

### 2. Simple Client Component

**Example:** `status/page.tsx`

**Before (Next.js):**

```tsx


import { api } from "~/trpc/react";
import { BotIcon } from "../components/BotIcon";

export default function StatusPage() {
  const status = api.bot.getStatus.useQuery(/* ... */);
  return (/* ... */);
}
```

**After (React Router):**

```tsx
import { api } from "~/trpc/react";
import { BotIcon } from "~/app/components/BotIcon";

export default function StatusPage() {
  const status = api.bot.getStatus.useQuery(/* ... */);
  return (/* ... */);
}
```

**Changes:**

- ✅ Remove `"use client"` directive (not needed in Vite)
- ✅ Update relative imports to use `~/app/` prefix
- ✅ Everything else stays the same!

---

### 3. Page with Links

**Example:** `dashboard/servers/[guildId]/page.tsx`

**Before (Next.js):**

```tsx
export default function Page() {
  return (
    <Link href="/some-path" target="_blank">
      Click me
    </Link>
  );
}
```

**After (React Router):**

```tsx
import { Link } from "react-router";

export default function SomePage() {
  return (
    <Link to="/some-path" target="_blank">
      Click me
    </Link>
  );
}
```

**Changes:**

- ✅ Remove `"use client"`

- ✅ `href` prop → `to` prop

---

### 4. Protected Page with Authentication

**Example:** `account/page.tsx`

**Before (Next.js):**

```tsx
export default function Page() {
  const isAuthenticated = api.session.isAuthenticated.useQuery();
  if (isAuthenticated.data === false) redirect(Routes.Login);

  return (
    <div>
      <Link href={Routes.LogOut}>Logout</Link>
    </div>
  );
}
```

**After (React Router):**

```tsx
import { Link, Navigate } from "react-router";

export default function AccountPage() {
  const isAuthenticated = api.session.isAuthenticated.useQuery();

  if (isAuthenticated.data === false) {
    return <Navigate to={Routes.Login} replace />;
  }

  return (
    <div>
      <Link to={Routes.LogOut}>Logout</Link>
    </div>
  );
}
```

**Changes:**

- ✅ Remove `"use client"`
- ✅ `redirect()` → `<Navigate>` component with early return
- ✅ `Link href` → `Link to`

**Alternative - Use ProtectedRoute wrapper:**

```tsx
// In router.tsx
<Route
  path={routes.account.$path()}
  element={
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  }
/>
```

---

### 5. Page with Dynamic Params

**Example:** `dashboard/servers/[guildId]/page.tsx`

**Before (Next.js):**

```tsx
export default function Page() {
  const params = useParams<{ guildId: string }>();
  return <div>Guild: {params.guildId}</div>;
}
```

**After (React Router):**

```tsx
import { useTypedParams } from "react-router-typesafe-routes/dom";

import { routes } from "@mc/common/Routes";

export default function GuildPage() {
  const { guildId } = useTypedParams(routes.dashboard.servers);
  return <div>Guild: {guildId}</div>;
}
```

**Changes:**

- ✅ Remove `"use client"`
- ✅ `useParams<T>()` → `useTypedParams(route)`
- ✅ Fully type-safe params from route definition

---

### 6. Page with Search Params

**Example:** `invite/page.tsx`

**Before (Next.js):**

```tsx
export default function Page() {
  const searchParams = useSearchParams();
  const guildId = searchParams.get("guildId");
  return <div>Guild: {guildId}</div>;
}
```

**After (React Router):**

```tsx
import { useTypedSearchParams } from "react-router-typesafe-routes/dom";

import { routes } from "@mc/common/Routes";

export default function InvitePage() {
  const [{ guildId }] = useTypedSearchParams(routes.invite);
  return <div>Guild: {guildId}</div>;
}
```

**Changes:**

- ✅ Remove `"use client"`
- ✅ `useSearchParams()` → `useTypedSearchParams(route)`
- ✅ Type-safe search params

---

### 7. Page with Navigation

**Example:** Some admin page

**Before (Next.js):**

```tsx
export default function Page() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/some-path");
  };

  return <button onClick={handleClick}>Go</button>;
}
```

**After (React Router):**

```tsx
import { useNavigate } from "react-router";

export default function SomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/some-path");
  };

  return <button onClick={handleClick}>Go</button>;
}
```

**Changes:**

- ✅ Remove `"use client"`
- ✅ `useRouter()` → `useNavigate()`
- ✅ `router.push()` → `navigate()`
- ✅ `router.back()` → `navigate(-1)`
- ✅ `router.replace()` → `navigate(path, { replace: true })`

---

## File Organization

### Directory Structure

```
src/
├── pages/              # NEW: React Router pages
│   ├── Account.tsx
│   ├── Logout.tsx
│   ├── Status.tsx
│   └── dashboard/
│       └── DashboardServerHome.tsx
├── app/                # KEEP: Original Next.js components & utilities
│   ├── components/     # Shared components
│   ├── account/        # Account-specific components
│   ├── dashboard/      # Dashboard-specific components
│   └── page.tsx        # Home page (can stay here)
├── components/         # NEW: Router-level components
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
└── router.tsx          # NEW: React Router configuration
```

### Naming Convention

- Page components: `SomePage` (PascalCase with "Page" suffix)
- Files: Match the route (e.g., `Account.tsx` for `/account`)
- Keep supporting components in `app/` directory

---

## Router Configuration

### Adding Routes

```tsx
// src/router.tsx
import { BrowserRouter, Route, Routes } from "react-router";

import { routes } from "@mc/common/Routes";

export default function Router() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path={routes.status.$path()} element={<StatusPage />} />

          {/* Protected routes */}
          <Route
            path={routes.account.$path()}
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          {/* Dynamic routes */}
          <Route
            path={routes.dashboard.servers.$path()}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
```

---

## Common Issues & Solutions

### Issue: Absolute imports not working

**Solution:** Use `~/` prefix for imports (configured in `tsconfig.json`)

```tsx
import { routes } from "@mc/common/Routes";

import { api } from "~/trpc/react";
```

### Issue: Images not loading

**Solution:**

- Place images in `public/` directory
- Reference as `/image.png` (relative to public)

### Issue: Fonts not working

**Solution:**

- Remove `next/font` imports
- Use CSS `@font-face` in `globals.css`, or
- Keep using `next/font` temporarily (it still works in React)

### Issue: Environment variables not available

**Solution:**

- Use `import.meta.env.VITE_*` instead of `process.env.VITE_*`
- Update `.env` file with `VITE_` prefixed variables
- Use `env.ts` helper for type-safe access

---

## Checklist for Each Page

- [ ] Remove `"use client"` directive
- [ ] Update imports:
  - [ ] `next/link` → `react-router`

  - [ ] Relative imports → `~/app/` prefix

- [ ] Replace components:
  - [ ] `<Link href>` → `<Link to>`
  - [ ] `redirect()` → `<Navigate>`
- [ ] Replace hooks:
  - [ ] `useRouter()` → `useNavigate()`
  - [ ] `useParams()` → `useTypedParams(route)`
  - [ ] `useSearchParams()` → `useTypedSearchParams(route)`
- [ ] Move file to `src/pages/`
- [ ] Add route to `router.tsx`
- [ ] Test the page in browser

---

## Examples Completed

✅ **Logout** - Simple redirect
✅ **Status** - Simple client component
✅ **DashboardServerHome** - Component with links
✅ **Account** - Protected page with authentication

## Remaining Pages (~17)

See `router.tsx` TODO comment for full list of pages to convert.
