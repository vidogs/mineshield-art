FROM ubuntu:24.04 AS build

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

RUN apt-get update

RUN apt-get install -y nodejs npm

COPY .. .

ENV NODE_ENV=development

COPY package.json package-lock.json ./

RUN npm ci

RUN npm run build

FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY build/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /usr/share/nginx/html/config.js

COPY build/docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
