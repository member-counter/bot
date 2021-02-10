FROM node:latest as node_modules_cache

WORKDIR /cache/
COPY package.json .
COPY package-lock.json .
RUN npm prune 
RUN npm install


FROM node:latest

WORKDIR /app
COPY --from=node_modules_cache /cache/ .
COPY . .

EXPOSE $PORT

RUN npm run build

CMD ["node", "."]