FROM node:latest

WORKDIR /app

COPY . .

EXPOSE 9090

RUN npm install

RUN npm run build

CMD ["npm", "start"]