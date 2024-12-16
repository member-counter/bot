FROM node:20-alpine AS base
ENV DO_NOT_TRACK=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN pnpm add -g turbo@2
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune @mc/website --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat make gcc g++ python3 git
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
RUN pnpm install
 
# Build the project
COPY --from=builder /app/out/full/ .
ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV='production'\
    NEXT_PUBLIC_SUPPORT_URL='https://discord.com/invite/g4MfV6N'\ 
    NEXT_PUBLIC_BOT_DOCS_URL='https://docs.membercounter.app/'\
    NEXT_PUBLIC_BOT_REPO_URL='https://github.com/member-counter/bot'\
    NEXT_PUBLIC_TRANSLATION_PLATFORM_URL='https://tolgee.membercounter.app/'\
    NEXT_PUBLIC_SENTRY_ADMIN_URL='https://sentry.membercounter.app/'

RUN pnpm turbo run build --filter=@mc/website
 
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/website/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/website/.next/static ./apps/website/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/website/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "/app/apps/website/server.js"]