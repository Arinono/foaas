FROM node:alpine

COPY . .
RUN npm i

ENTRYPOINT [ "node", "app.js" ]