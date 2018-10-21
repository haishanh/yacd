# yacd

> Yet Another Clash Dashboard

Note for Firefox user:

**yacd** is using the [Fetch (Web) API][fetch-api] to stream chunked API response from Clash to draw the traffic chart. But currently the streaming feature in Firefox needs to be turned on manually. Here is how to:

Visit `about:config`, search for `dom.streams.enabled` and `javascript.options.streams`, double click those items to turn them on.

[fetch-api]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## Development

```sh
# install dependencies
yarn

# start the dev server
yarn start

# go to http://127.0.0.1:3000
```
