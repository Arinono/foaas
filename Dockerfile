FROM node:latest

COPY package.json .

RUN npm i

COPY . .

ENTRYPOINT [ "node", "app.js" ]