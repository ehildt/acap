FROM node:20 AS local
WORKDIR /app
ENTRYPOINT ["npm", "run", "dev"]

FROM node:20-slim AS bundle
WORKDIR /app
COPY ./ ./
RUN npm i -g pnpm && pnpm i --ignore-scripts && pnpm run build:prod

FROM nginx:alpine AS production
ENV NGINX_HOST 127.0.0.1
ENV NGINX_PORT 80
EXPOSE ${NGINX_PORT}
COPY --from=bundle /app/dist/ /usr/share/nginx/html
