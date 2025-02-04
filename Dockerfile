FROM node:22-alpine3.21 AS base
ENV DO_NOT_TRACK=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable
RUN apk update
RUN apk add --no-cache libc6-compat 
 
FROM base AS app-deps
WORKDIR /app-deps
RUN apk update
RUN apk add --no-cache make gcc g++ python3 git curl
COPY pnpm-lock.yaml .
RUN pnpm fetch
