FROM node:alpine as node_modules_cache

WORKDIR /cache/
RUN apk add --no-cache make gcc g++ python3 git
COPY package.json .
COPY package-lock.json .
RUN npm install


FROM node:alpine

WORKDIR /app
RUN apk add --no-cache git
COPY --from=node_modules_cache /cache/ .
COPY . .

EXPOSE $PORT

RUN npm run build

CMD ["node", "."]