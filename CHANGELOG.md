# Changelog

## [0.1.25](https://github.com/haishanh/yacd/compare/v0.1.24...v0.1.25) (2020-07-01)

Added:

- support mixed-port

## [0.1.24](https://github.com/haishanh/yacd/compare/v0.1.23...v0.1.24) (2020-06-22)

Fixed:

- fix can not type in Chinese in proxy text filter input

## [0.1.23](https://github.com/haishanh/yacd/compare/v0.1.22...v0.1.23) (2020-06-20)

Added:

- add a simple filter for proxy names

Fixed:

- fix color display for unavailable proxy item

## [0.1.22](https://github.com/haishanh/yacd/compare/v0.1.21...v0.1.22) (2020-06-18)

Fixed:

- fix mode switching
- fix broken "Hide unavailable proxies" setting

Changed:

- make proxy group lowest latency item when sorting by latency

## [0.1.21](https://github.com/haishanh/yacd/compare/v0.1.20...v0.1.21) (2020-06-17)

Fixed:

- default to big latency for items with unavailable statistics when sorting

Added:

- a toggle to close old connections automatically when switching proxy
- use special color for non-proxy summary view dot item

## [0.1.20](https://github.com/haishanh/yacd/compare/v0.1.19...v0.1.20) (2020-06-08)

Changed:

- switch to Open Sans and reduce emitted font files

## [0.1.19](https://github.com/haishanh/yacd/compare/v0.1.18...v0.1.19) (2020-06-07)

Added:

- modal prompt to close previous connections when switch proxy

Fixed:

- mode not display correctly due to clash API change

Changed:

- switch primary font family from "Merriweather Sans" to "Inter", also starting to self hosting font files

## [0.1.18](https://github.com/haishanh/yacd/compare/v0.1.17...v0.1.18) (2020-06-04)

Added:

- test latency button for each proxy group

## [0.1.17](https://github.com/haishanh/yacd/compare/v0.1.16...v0.1.17) (2020-06-03)

Changed:

- reduce connections table visual width

## [0.1.16](https://github.com/haishanh/yacd/compare/v0.1.15...v0.1.16) (2020-05-31)

Added:

- filtering connections

## [0.1.15](https://github.com/haishanh/yacd/compare/v0.1.14...v0.1.15) (2020-05-25)

Added:

- add loading status to test latency button

## [0.1.14](https://github.com/haishanh/yacd/compare/v0.1.13...v0.1.14) (2020-05-17)

Added:

- button to pause connection refresh

Fixed:

- sorting option accessibility issue due to incorrect background in dark mode

## [0.1.13](https://github.com/haishanh/yacd/compare/v0.1.12...v0.1.13) (2020-05-01)

Changed:

- use color icons in sidebar (experimental)

## [0.1.12](https://github.com/haishanh/yacd/compare/v0.1.11...v0.1.12) (2020-04-26)

Features:

- allow change proxies sorting in group

## [0.1.11](https://github.com/haishanh/yacd/compare/v0.1.10...v0.1.11) (2020-03-21)

Features:

- remembers group collapse state

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
