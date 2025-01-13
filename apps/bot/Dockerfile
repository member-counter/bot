FROM node:20-alpine3.20 AS base
ENV DO_NOT_TRACK=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
 
FROM base AS repo
WORKDIR /app
RUN pnpm add -g turbo@2
COPY . .
RUN turbo prune @mc/botz --docker

FROM base AS build_deps
RUN apk update
RUN apk add --no-cache libc6-compat make gcc g++ python3 git
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=repo /app/out/json/ .
COPY --from=repo /app/packages/db/prisma ./packages/db/prisma
RUN pnpm install

FROM build_deps AS prod_deps
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=repo /app/out/json/ .
COPY --from=repo /app/packages/db/prisma ./packages/db/prisma
# needed due to warning: https://pnpm.io/cli/prune/
RUN rm -rf node_modules
RUN pnpm install --prod


FROM build_deps AS builder
WORKDIR /app
COPY --from=repo /app/out/full/ .
RUN pnpm turbo run build --filter=@mc/botz

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=prod_deps /app/node_modules ./node_modules
COPY --from=repo /app/apps/bot/package.json .
COPY --from=builder --chown=nodejs:nodejs /app/apps/bot/dist ./
CMD ["node", "/app/index.js"]