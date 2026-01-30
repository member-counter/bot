# Migration Testing Guide

This guide outlines how to test the Next.js → Vite SPA migration.

## Prerequisites

Ensure you have:
- Node.js and pnpm installed
- MongoDB running (replica set configured)
- Redis running
- Discord OAuth credentials configured in `.env`

## Environment Setup

1. Copy `.env.example` to `.env` if you haven't already:
```bash
cp .env.example .env
```

2. Ensure these environment variables are set in `.env`:
```bash
# Backend (Express)
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=mongodb://...
COOKIE_SECRET=... (at least 32 characters)
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_OAUTH2_REDIRECT_URI=http://localhost:3000/api/auth/callback
PUBLIC_BOTS_IDS='["main"]'

# Frontend (Vite)
VITE_SUPPORT_URL=https://discord.com/invite/g4MfV6N
VITE_BOT_DOCS_URL=https://docs.membercounter.app/
VITE_BOT_REPO_URL=https://github.com/member-counter/bot
VITE_TRANSLATION_PLATFORM_URL=https://tolgee.membercounter.app/
VITE_DISCORD_CLIENT_ID=... (same as DISCORD_CLIENT_ID)
```

## Development Testing

### 1. Start Backend (Express)

```bash
cd apps/server
pnpm dev
```

Expected output:
```
Server listening on port 3001
Frontend URL: http://localhost:3000
tRPC endpoint: http://localhost:3001/api/trpc
```

### 2. Start Frontend (Vite SPA)

In a new terminal:
```bash
cd apps/website
pnpm dev
```

Expected output:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### 3. Manual Testing Checklist

#### Public Routes
- [ ] Navigate to `http://localhost:3000` - Home page loads
- [ ] Navigate to `/status` - Bot status page loads
- [ ] Navigate to `/donors` - Donors page loads (with bubble visualization)
- [ ] Navigate to `/legal` - Legal pages load with tabs
- [ ] Click on different legal tabs - URL updates, content changes
- [ ] Navigate to `/docs` - Redirects to external docs
- [ ] Navigate to `/support` - Redirects to Discord
- [ ] Navigate to `/invite` - Redirects to Discord bot invite
- [ ] Navigate to `/invite?guildId=123` - Guild ID is included in invite URL
- [ ] Navigate to `/premium` - Redirects to dashboard

#### Authentication Flow
- [ ] Navigate to `/login` - Redirects to Discord OAuth
- [ ] Complete Discord OAuth - Redirects back to app
- [ ] Session cookie is set (check DevTools → Application → Cookies)
- [ ] Navigate to `/account` - Shows user account page
- [ ] Click "Logout" button - Logs out successfully
- [ ] Try to access `/account` when logged out - Redirects to login

#### Dashboard Routes (Requires Auth)
- [ ] Navigate to `/dashboard` - Auto-redirects to first guild
- [ ] Navigate to `/dashboard/servers` - Shows server list
- [ ] Click on a server - Shows guild page with suggested topics
- [ ] Click on a channel - Shows channel editor
- [ ] Navigate to guild settings - Settings page loads
- [ ] Make changes to settings - Can save successfully
- [ ] Form shows "Saved" state after saving

#### Admin Routes (Requires Permissions)
- [ ] Navigate to `/admin/users` - Shows recent users (if you have SeeUsers permission)
- [ ] Navigate to `/admin/users/:userId` - Shows user detail
- [ ] Navigate to `/admin/guilds` - Shows guild management
- [ ] Navigate to `/admin/homepage` - Shows demo servers
- [ ] Navigate to `/admin/donations` - Shows donations list
- [ ] Try accessing admin routes without permissions - Shows 403 error

#### i18n (Internationalization)
- [ ] Language selector works (if available)
- [ ] Page text changes based on selected language
- [ ] Language preference persists on reload (check cookie)
- [ ] `document.documentElement.lang` updates correctly

#### API Integration
- [ ] Open DevTools → Network tab
- [ ] Navigate through different pages
- [ ] Verify tRPC calls go to `http://localhost:3001/api/trpc`
- [ ] Verify responses are successful (200 status)
- [ ] Check that cookies are sent with requests (credentials: include)

## Production Build Testing

### 1. Build Backend

```bash
cd apps/server
pnpm build
```

Expected: No errors, `dist/` folder created

### 2. Build Frontend

```bash
cd apps/website
pnpm build
```

Expected: No errors, `dist/` folder created

### 3. Test Production Builds

Start backend:
```bash
cd apps/server
pnpm start
```

In another terminal, preview frontend:
```bash
cd apps/website
pnpm preview
```

Run through the manual testing checklist again with production builds.

## Common Issues

### Issue: CORS errors
**Solution**: Verify `FRONTEND_URL` in backend `.env` matches the frontend URL

### Issue: Session not persisting
**Solution**: Check that `COOKIE_SECRET` is set and at least 32 characters long

### Issue: OAuth callback fails
**Solution**: Verify `DISCORD_OAUTH2_REDIRECT_URI` matches Discord app settings

### Issue: tRPC calls fail
**Solution**:
- Ensure backend is running on port 3001
- Check Vite proxy configuration in `vite.config.ts`
- Verify `/api` requests are being proxied to backend

### Issue: Environment variables not available
**Solution**:
- Ensure variables are prefixed with `VITE_` for frontend
- Restart Vite dev server after changing `.env`

### Issue: Build fails
**Solution**:
- Check for TypeScript errors: `pnpm typecheck`
- Check for linting errors: `pnpm lint`
- Ensure all dependencies are installed: `pnpm install`

## Performance Testing

- [ ] Check Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- [ ] Verify initial page load time is acceptable
- [ ] Check bundle sizes in `dist/` folder
- [ ] Verify code splitting is working (multiple JS chunks)

## Next Steps

Once all tests pass:
1. Review `CLEANUP_CHECKLIST.md`
2. Delete old Next.js files
3. Remove Next.js dependencies from `package.json`
4. Update deployment configuration
5. Test deployment in staging environment
6. Deploy to production

---

**Found an issue?** Document it and fix before proceeding with cleanup!
