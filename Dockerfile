# Install necessary dependencies to install the app's dependencies
FROM node:16-alpine as base_dependencies
RUN apk add --no-cache make gcc g++ python3 git
RUN npm install -g pnpm

# Ignore the app's version to avoid an unnecessary dependency install
FROM node:16-alpine as version_cache_fix
WORKDIR /cache
COPY package*.json ./
# '3d' is the 3rd line of package*.json
# If you are gonna use this in your project remember to select the right line (where the "version" field is)
RUN sed -e '3d' -i package.json package-lock.json

# install dependencies for building the app
FROM base_dependencies as app_building_dependencies
WORKDIR /cache
COPY --from=version_cache_fix /cache /cache
RUN pnpm install

# install dependencies for production 
FROM app_building_dependencies as app_production_dependencies
WORKDIR /cache
COPY --from=version_cache_fix /cache /cache
RUN pnpm prune --prod

# compile the app using the cached dev dependencies
FROM node:16-alpine as builder
WORKDIR /app
COPY . .
COPY --from=app_building_dependencies /cache/node_modules ./node_modules
RUN npm run build

# copy the cached dependencies, copy the compiled code and set entrypoint
FROM node:16-alpine as release
WORKDIR /app
COPY package*.json ./
COPY --from=app_production_dependencies /cache/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "."]
