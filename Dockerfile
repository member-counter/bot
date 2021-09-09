# Ignore the app's version to avoid an unnecessary dependency install
FROM node:16-alpine as pre_node_modules_cache
WORKDIR /cache
COPY package*.json ./
# '3d' is the 3rd line of package*.json
# If you are gonna use this in your project remember to select the right line (where the "version" field is)
RUN sed -e '3d' -i package.json package-lock.json

# install dev dependencies
FROM node:16-alpine as node_modules_cache_full
WORKDIR /cache
RUN apk add --no-cache make gcc g++ python3 git
COPY --from=pre_node_modules_cache /cache /cache
RUN npm ci --include=dev

# install dependencies
FROM node:16-alpine as node_modules_cache_prod
WORKDIR /cache
RUN apk add --no-cache make gcc g++ python3 git
COPY --from=pre_node_modules_cache /cache /cache
RUN npm ci --production

# compile the app using the cached dev dependencies
FROM node:16-alpine as builder
WORKDIR /app
COPY . .
COPY --from=node_modules_cache_full /cache/node_modules ./node_modules
RUN npm run build

# copy the cached dependencies, copy the compiled code and set entrypoint
FROM node:16-alpine as release
WORKDIR /app
COPY package*.json ./
COPY --from=node_modules_cache_prod /cache/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "."]
