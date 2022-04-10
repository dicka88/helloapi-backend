FROM node:16-alpine as build

WORKDIR /home/node/helloapi-backend

COPY . /home/node/helloapi-backend

RUN yarn install
RUN yarn build

EXPOSE 3001
CMD ["node", "dist/server.js"]