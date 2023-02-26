#!/bin/sh
sed -i "s|http://127.0.0.1:9090|$YACD_DEFAULT_BACKEND|" /usr/share/nginx/html/index.html
exec nginx -g "daemon off;"
