FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN yarn && yarn run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/public /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
