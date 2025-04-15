FROM node:22-alpine3.20 AS base
ENV DO_NOT_TRACK=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
    && corepack prepare pnpm@9.15.5+sha1.cb1f6372ef64e2ba352f2f46325adead1c99ff8f --activate
RUN apk update
RUN apk add --no-cache libc6-compat 
 
FROM base AS repo
WORKDIR /app
RUN pnpm add -g turbo@2
COPY . .
RUN turbo prune @mc/db --docker

FROM base AS deps
COPY --from=ghcr.io/member-counter/pnpm-store-cache:latest $PNPM_HOME/store $PNPM_HOME/store
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=repo /app/out/json/ .
COPY --from=repo /app/out/full/packages/db/prisma ./packages/db/prisma
RUN pnpm install --prefer-offline

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=repo /app/out/full/ .
CMD ["tail", "-f", "/dev/null"]
