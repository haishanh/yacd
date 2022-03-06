<h1 align="center">
  <img src="https://user-images.githubusercontent.com/1166872/47954055-97e6cb80-dfc0-11e8-991f-230fd40481e5.png" alt="yacd">
</h1>

> Yet Another [Clash](https://github.com/Dreamacro/clash) [Dashboard](https://github.com/Dreamacro/clash-dashboard)

The site [http://yacd.haishan.me](http://yacd.haishan.me) is served with HTTP not HTTPS is because many browsers block requests to HTTP resources from a HTTPS website. If you think it's not safe, you could just download the [zip of the gh-pages](https://github.com/haishanh/yacd/archive/gh-pages.zip), unzip and open or serve `index.html` directly.

Docker image

- Docker Hub [`haishanh/yacd`](https://hub.docker.com/r/haishanh/yacd)
- GitHub Container Registry [`ghcr.io/haishanh/yacd`](https://github.com/haishanh/yacd/pkgs/container/yacd)

## Development

```sh
# install dependencies
yarn

# start the dev server
# then go to http://127.0.0.1:3000
yarn start


# build optimized assets
# ready to deploy assets will be in the directory `public`
yarn build
```
