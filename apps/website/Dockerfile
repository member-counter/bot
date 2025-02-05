FROM node:22-alpine3.20 AS base
ENV DO_NOT_TRACK=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable 
RUN corepack use pnpm@9.15.5+sha1.cb1f6372ef64e2ba352f2f46325adead1c99ff8f
RUN apk update
RUN apk add --no-cache libc6-compat

FROM base AS repo
WORKDIR /app
RUN pnpm add -g turbo@2
COPY . .
RUN turbo prune @mc/website --docker

FROM base AS build_deps
COPY --from=ghcr.io/member-counter/pnpm-store-cache:latest $PNPM_HOME/store $PNPM_HOME/store
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=repo /app/out/json/ .
COPY --from=repo /app/packages/db/prisma ./packages/db/prisma
RUN pnpm install --prefer-offline

FROM build_deps AS builder
WORKDIR /app
COPY --from=repo /app/out/full/ .

ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV='production'

ARG NEXT_PUBLIC_SUPPORT_URL
ENV NEXT_PUBLIC_SUPPORT_URL=${NEXT_PUBLIC_SUPPORT_URL}

ARG NEXT_PUBLIC_BOT_DOCS_URL
ENV NEXT_PUBLIC_BOT_DOCS_URL=${NEXT_PUBLIC_BOT_DOCS_URL}

ARG NEXT_PUBLIC_BOT_REPO_URL
ENV NEXT_PUBLIC_BOT_REPO_URL=${NEXT_PUBLIC_BOT_REPO_URL}

ARG NEXT_PUBLIC_TRANSLATION_PLATFORM_URL
ENV NEXT_PUBLIC_TRANSLATION_PLATFORM_URL=${NEXT_PUBLIC_TRANSLATION_PLATFORM_URL}

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
COPY --from=builder --chown=nextjs:nodejs /app/apps/website/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/website/.next/static ./apps/website/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/website/public ./apps/website/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "/app/apps/website/server.js"]