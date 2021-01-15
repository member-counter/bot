FROM node:latest

WORKDIR /app

COPY . .

EXPOSE $PORT

RUN npm install

RUN npm run build

CMD ["node", "."]