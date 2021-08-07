FROM node:alpine as node_modules_cache_full
WORKDIR /cache
RUN apk add --no-cache make gcc g++ python3 git
COPY package*.json ./
RUN npm ci --include=dev

FROM node:alpine as node_modules_cache_prod
WORKDIR /cache
RUN apk add --no-cache make gcc g++ python3 git
COPY package*.json ./
RUN npm ci --production

FROM node:alpine as builder
WORKDIR /app
COPY . .
COPY --from=node_modules_cache_full /cache/node_modules ./node_modules
RUN npm run build

FROM node:alpine as release
WORKDIR /app
COPY package*.json .
COPY --from=node_modules_cache_prod /cache/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "."]
