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
RUN turbo prune @mc/botz --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat make gcc g++ python3 git
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=@mc/botz

FROM installer AS prod_deps
WORKDIR /app
RUN pnpm prune --prod
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/bot/package.json .
COPY --from=installer --chown=nodejs:nodejs /app/apps/bot/dist ./
CMD ["node", "/app/index.js"]