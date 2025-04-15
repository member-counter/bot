FROM node:22-alpine3.21 AS base
ENV DO_NOT_TRACK=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
    && corepack prepare pnpm@9.15.5+sha1.cb1f6372ef64e2ba352f2f46325adead1c99ff8f --activate
RUN apk update
RUN apk add --no-cache libc6-compat 

FROM base AS app-deps
WORKDIR /app-deps
RUN apk update
RUN apk add --no-cache make gcc g++ python3 git curl
COPY pnpm-lock.yaml .
RUN pnpm fetch

FROM app-deps AS tooling
WORKDIR /app
COPY . .

FROM app-deps AS default
