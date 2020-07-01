<h1 align="center">
  <img src="https://user-images.githubusercontent.com/1166872/47954055-97e6cb80-dfc0-11e8-991f-230fd40481e5.png" alt="yacd">
</h1>

> Yet Another [Clash](https://github.com/Dreamacro/clash) [Dashboard](https://github.com/Dreamacro/clash-dashboard)

The site [http://yacd.haishan.me](http://yacd.haishan.me) is served with HTTP not HTTPS is because many browsers blocking request to HTTP resources from a HTTPS website. If you think it's not safe or has security concern, you can actually download the [zip of the gh-pages](https://github.com/haishanh/yacd/archive/gh-pages.zip), unzip and open `index.html` directly.

[Docker image](https://hub.docker.com/r/haishanh/yacd) is also available as `haishanh/yacd`.

Extra note for Firefox users:

**yacd** is using the [Fetch (Web) API][fetch-api] to stream chunked API response from Clash to draw the traffic chart. But currently the streaming feature in Firefox needs to be turned on manually. Here is how to:

Visit `about:config`, search for `dom.streams.enabled` and `javascript.options.streams`, double click those items to turn them on.

[fetch-api]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

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
