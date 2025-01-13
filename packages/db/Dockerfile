FROM node:20-alpine3.20 AS base
ENV DO_NOT_TRACK=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
 
FROM base AS repo
WORKDIR /app
RUN pnpm add -g turbo@2
COPY . .
RUN turbo prune @mc/db --docker

FROM base AS deps
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=repo /app/out/json/ .
COPY --from=repo /app/out/full/packages/db/prisma ./prisma
RUN pnpm install

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=repo /app/out/full/ .
CMD ["tail", "-f", "/dev/null"]