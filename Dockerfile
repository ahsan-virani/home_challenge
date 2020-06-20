FROM node:12-slim

COPY . /usr/src/app
WORKDIR /usr/src/app

ENTRYPOINT [ "node", "/usr/src/app/app.js" ]
