# Changelog

## [0.1.10](https://github.com/haishanh/yacd/compare/v0.1.9...v0.1.10) (2020-03-14)

Fixes:

- fix broken allow-lan switch

Features:

- support set theme with querystring `?theme=dark` or `?theme=light`

## [0.1.9](https://github.com/haishanh/yacd/compare/v0.1.8...v0.1.9) (2020-03-01)

Fixes:

- allow request latency for non-original clash proxy types

## [0.1.8](https://github.com/haishanh/yacd/compare/v0.1.7...v0.1.8) (2020-03-01)

Features:

- support overwrite API hostname in querystring with `?hostname=`
- show current download/upload speed of connections

## [0.1.7](https://github.com/haishanh/yacd/compare/v0.1.6...v0.1.7) (2020-02-11)

Refactor:

- proxies page UI improvement

Fixes:

- use destination ip as host if host is an empty string

## [0.1.6](https://github.com/haishanh/yacd/compare/v0.1.5...v0.1.6) (2020-01-07)

Features:

- keep up to 100 closed connections in another tab

## [0.1.5](https://github.com/haishanh/yacd/compare/v0.1.4...v0.1.5) (2020-01-04)

Features:

- support change latency test url #286

## [0.1.4](https://github.com/haishanh/yacd/compare/v0.1.3...v0.1.4) (2020-01-03)

Features:

- refresh providers and proxies on window regain focus

Fixes:

- optimize test latency action when there are providers
- do not show provider section when is no provider

## [0.1.3](https://github.com/haishanh/yacd/compare/v0.1.2...v0.1.3) (2019-12-27)

Features:

- can healthcheck a provider

## [0.1.2](https://github.com/haishanh/yacd/compare/v0.1.1...v0.1.2) (2019-12-22)

Fixes:

- typo in connections table header

## [0.1.1](https://github.com/haishanh/yacd/compare/v0.1.0...v0.1.1) (2019-12-21)

Fixes:

- connections table header data miss alignment

## [0.1.0](https://github.com/haishanh/yacd/compare/v0.0.10...v0.1.0) (2019-12-20)

Features:

- support proxy provider

## [0.0.10](https://github.com/haishanh/yacd/compare/v0.0.9...v0.0.10) (2019-12-04)

Features:

- add upload/download total and connectors number on overview

## [0.0.9](https://github.com/haishanh/yacd/compare/v0.0.8...v0.0.9) (2019-12-02)

Fix:

- specify fab group z-index

## [0.0.8](https://github.com/haishanh/yacd/compare/v0.0.7...v0.0.8) (2019-12-01)

Features:

- support close all connections

## [0.0.7](https://github.com/haishanh/yacd/compare/v0.0.6...v0.0.7) (2019-11-20)

Features:

- use history latency data

## [0.0.6](https://github.com/haishanh/yacd/compare/v0.0.5...v0.0.6) (2019-11-17)

Improvements:

- improve UI for small screens
- connections: update connections table sorting indicator icon
- connections: add place holder when there is no connections data

## [0.0.5](https://github.com/haishanh/yacd/compare/v0.0.4...v0.0.5) (2019-11-09)

Features:

- connections inspection

## [0.0.4](https://github.com/haishanh/yacd/compare/v0.0.3...v0.0.4) (2019-10-14)

Features:

- probing the API server with the given url and auto fill hostname and port

Internal:

- upgrade dependencies
