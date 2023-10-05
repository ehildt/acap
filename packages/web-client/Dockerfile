FROM node:lts AS local
WORKDIR /app
ENTRYPOINT ["npm", "run", "dev"]

FROM node:lts AS bundle
WORKDIR /app
COPY ./ ./
RUN npm ci --legacy-peer-deps=true --ignore-scripts --loglevel=error
RUN npm run build

FROM nginx:alpine AS production
ENV NGINX_HOST 127.0.0.1
ENV NGINX_PORT 80
EXPOSE ${NGINX_PORT}
COPY --from=bundle /app/dist/ /usr/share/nginx/html
