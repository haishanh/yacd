ARG COMMIT_SHA=""

FROM --platform=$BUILDPLATFORM node:alpine AS builder
WORKDIR /app

RUN npm i -g pnpm
COPY pnpm-lock.yaml package.json ./
COPY ./patches/ ./patches/
RUN pnpm i

COPY . .
RUN pnpm build \
  # remove source maps - people like small image
  && rm public/*.map || true

FROM --platform=$TARGETPLATFORM alpine
# the brotli module is only in the alpine *edge* repo
# https://pkgs.alpinelinux.org/package/edge/main/x86/nginx-mod-http-brotli
RUN apk add \
  nginx \
  nginx-mod-http-brotli \
  --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community
COPY docker/nginx-default.conf /etc/nginx/http.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/public /usr/share/nginx/html
ENV YACD_DEFAULT_BACKEND "http://127.0.0.1:9090"
ADD docker-entrypoint.sh /
CMD ["/docker-entrypoint.sh"]
