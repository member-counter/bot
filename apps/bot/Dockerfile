ARG JS_SOURCE_IMAGE

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
RUN turbo prune @mc/botz --docker

FROM base AS deps-base
COPY --from=ghcr.io/member-counter/pnpm-store-cache:beta $PNPM_HOME/store $PNPM_HOME/store
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=repo /app/out/json/ .
COPY --from=repo /app/packages/db/prisma ./packages/db/prisma

FROM deps-base AS build_deps
RUN pnpm install --prefer-offline

FROM deps-base AS prod_deps
RUN pnpm install --prod --prefer-offline

FROM build_deps AS builder
WORKDIR /app
COPY --from=repo /app/out/full/ .
RUN pnpm turbo run build --filter=@mc/botz

FROM --platform=linux/amd64 ${JS_SOURCE_IMAGE} AS js-source

FROM base AS runner
RUN apk update
RUN apk add --no-cache jq
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs
COPY --from=prod_deps /app/node_modules ./node_modules
COPY --from=repo /app/apps/bot/package.json .
COPY --from=js-source --chown=nodejs:nodejs /app/apps/bot/dist ./
CMD node --experimental-loader=@opentelemetry/instrumentation/hook.mjs --import /app/telemetry.js /app/index.js
