FROM node:20.12.2
RUN npm i -g tsoa nodemon

COPY . /backend

WORKDIR /backend
RUN npm ci

EXPOSE 3000
CMD ["nodemon", "--exec", "ts-node", "src/server.ts"]
