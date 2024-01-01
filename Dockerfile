FROM node:11.6.0-alpine AS builder
COPY . ./angular-14-migration
WORKDIR /angular-14-migration
RUN npm i
RUN npm audit fix
RUN $(npm bin)/ng build --prod --aot=false

FROM nginx:1.15.8-alpine
COPY --from=builder /gotracrat-web-app/dist/* /usr/share/nginx/html/