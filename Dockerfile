FROM node:14.0.0-alpine3.10

WORKDIR /usr/src/app

COPY . .

EXPOSE 9090

RUN apk add --no-cache python make g++

RUN npm install

RUN npm run build

RUN npm install pm2 -g

CMD ["pm2-runtime", "./dist/src/index.js"]