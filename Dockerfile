FROM --platform=$BUILDPLATFORM node:alpine AS builder
WORKDIR /app
COPY . .
# Using yarn to install dependencies in CI will cause network timeout
# Refer to https://github.com/date-fns/date-fns/issues/1004
RUN yarn config set network-timeout 300000 \
  && yarn \
  && yarn build \
  # remove source maps - people like small image
  && rm public/*.map || true

FROM --platform=$TARGETPLATFORM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/public /usr/share/nginx/html
ENV YACD_DEFAULT_BACKEND "http://127.0.0.1:9090"
ADD docker-entrypoint.sh /
CMD ["/docker-entrypoint.sh"]
