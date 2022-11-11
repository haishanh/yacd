# Changelog

## [0.3.8](https://github.com/haishanh/yacd/compare/v0.3.7...v0.3.8) (2022-11-11)

Fixed:

- Compatible with backend that doesn't support processPath

## [0.3.7](https://github.com/haishanh/yacd/compare/v0.3.6...v0.3.7) (2022-11-07)

Added:

- Add "Process" columns to connections
- Add "theme-color" meta tags
- Support labeling backends

Changed:

- Blended sidebar style

## [0.3.6](https://github.com/haishanh/yacd/compare/v0.3.5...v0.3.6) (2022-07-23)

Changed:

- Make proxy item card same width
- Always show update and health check buttons for providers

Fixed:

- Encode latency test url
- Encode proxy or group name when they are parts of API url

## [0.3.5](https://github.com/haishanh/yacd/compare/v0.3.4...v0.3.5) (2022-05-14)

Added:

- Added "Auto" theme option for theme to follow system theme preference
- Display rule payload if possible in rule column of connections table
- Allow override default backend url use environment variable with docker container
- Gzip and cache static assets in docker container
- Docker image is now published to ghcr too

Changed:

- Use Inter as app wide font

## [0.3.4](https://github.com/haishanh/yacd/compare/v0.3.3...v0.3.4) (2021-11-14)

Added:

- Add float action button to pause/start log streaming

## [0.3.3](https://github.com/haishanh/yacd/compare/v0.3.2...v0.3.3) (2021-07-19)

Added:

- Support switch theme on backend config page
- If / is api server, use it as default

## [0.3.2](https://github.com/haishanh/yacd/compare/v0.3.1...v0.3.2) (2021-06-07)

Changed:

- Change web base to './'

## [0.3.1](https://github.com/haishanh/yacd/compare/v0.3.0...v0.3.1) (2021-06-06)

Fixed:

- Fixed floating action button style

## [0.3.0](https://github.com/haishanh/yacd/compare/v0.2.15...v0.3.0) (2021-06-05)

Changed:

- Switch the build system to use Vite. This should not change much about user experience.
- Style tweaks:
  - The light theme now use a light gray background instead of a pure white
  - Statistic blocks on Overview are now styled more like a card
  - Log type badges are now ellipse shaped
  - Config fields are more compact now

Added:

- Request logs with configured log level
- Reconnect logs web socket on log level config change

## [0.2.15](https://github.com/haishanh/yacd/compare/v0.2.14...v0.2.15) (2021-02-28)

Changed:

- Display API backend info in title only when there are multiple backends
- Changed the function of floating action button from refresh to update all providers on rules page

Added:

- Action button to update all proxies providers on proxies page

## [0.2.14](https://github.com/haishanh/yacd/compare/v0.2.13...v0.2.14) (2021-01-04)

Added:

- support set default Clash API baseURL with data attribute in HTML template (see [details](https://github.com/haishanh/yacd/pull/550))
- add apple-touch-icon\*.png

Fixed:

- encode URI for latency test url

## [0.2.13](https://github.com/haishanh/yacd/compare/v0.2.12...v0.2.13) (2020-12-06)

Added:

- Initial Chinese UI language support

Fixed:

- Fix weird scroll behavior on config page

## [0.2.12](https://github.com/haishanh/yacd/compare/v0.2.11...v0.2.12) (2020-11-24)

Changed:

- Some minor accessibility improvements
- Changed log level display order to `debug warning info error silent`

## [0.2.11](https://github.com/haishanh/yacd/compare/v0.2.10...v0.2.11) (2020-11-09)

Changed:

- Display proxy type "Shadowsocks" as "SS" to make proxy item tile more compact

## [0.2.10](https://github.com/haishanh/yacd/compare/v0.2.9...v0.2.10) (2020-11-06)

Added:

- Precache assets with service worker.

## [0.2.9](https://github.com/haishanh/yacd/compare/v0.2.8...v0.2.9) (2020-11-01)

Added:

- Display current backend host in title.

Changed:

- Change backend baseURL default port to 9090.

## [0.2.8](https://github.com/haishanh/yacd/compare/v0.2.7...v0.2.8) (2020-10-12)

Added:

- Better error message for filling API base URL without providing a http protocol prefix.

## [0.2.7](https://github.com/haishanh/yacd/compare/v0.2.6...v0.2.7) (2020-09-13)

Added:

- multi backends management (see "Switch backend" action the the bottom of Config page)

## [0.2.6](https://github.com/haishanh/yacd/compare/v0.2.5...v0.2.6) (2020-09-08)

Changed:

- use API base URL instead of hostname and port for Clash backend config

## [0.2.5](https://github.com/haishanh/yacd/compare/v0.2.4...v0.2.5) (2020-08-30)

Added:

- docker image arm and arm64 support

## [0.2.4](https://github.com/haishanh/yacd/compare/v0.2.3...v0.2.4) (2020-08-11)

Fixed:

- fix cannot change mixed port

## [0.2.3](https://github.com/haishanh/yacd/compare/v0.2.2...v0.2.3) (2020-08-06)

Changed:

- use desc sort first for columns with numeric value in connections table

## [0.2.2](https://github.com/haishanh/yacd/compare/v0.2.1...v0.2.2) (2020-08-01)

Added:

- a simple about page

Removed:

- logo in sidebar

## [0.2.1](https://github.com/haishanh/yacd/compare/v0.2.0...v0.2.1) (2020-07-13)

Fixed:

- uri-encode API secret for it to be used in url safely

## [0.2.0](https://github.com/haishanh/yacd/compare/v0.1.25...v0.2.0) (2020-07-04)

Added:

- support rule provider

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
