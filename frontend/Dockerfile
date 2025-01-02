FROM node:20.12.2
RUN apt-get update && \
    apt-get -y install default-jre
RUN npm i -g @angular/cli @openapitools/openapi-generator-cli

COPY . /app

WORKDIR /app

RUN npm install

RUN rm -rf src/generated && openapi-generator-cli generate
RUN npx tailwindcss -i ./src/styles.css -o ./src/output.css

EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]
