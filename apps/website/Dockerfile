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
RUN turbo prune @mc/website --docker

FROM base AS build_deps
COPY --from=ghcr.io/member-counter/pnpm-store-cache:beta $PNPM_HOME/store $PNPM_HOME/store
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

ARG VITE_SUPPORT_URL
ENV VITE_SUPPORT_URL=${VITE_SUPPORT_URL}

ARG VITE_BOT_DOCS_URL
ENV VITE_BOT_DOCS_URL=${VITE_BOT_DOCS_URL}

ARG VITE_BOT_REPO_URL
ENV VITE_BOT_REPO_URL=${VITE_BOT_REPO_URL}

ARG VITE_TRANSLATION_PLATFORM_URL
ENV VITE_TRANSLATION_PLATFORM_URL=${VITE_TRANSLATION_PLATFORM_URL}

RUN pnpm turbo run build --filter=@mc/website

FROM nginx:alpine
COPY --from=builder /app/apps/website/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
