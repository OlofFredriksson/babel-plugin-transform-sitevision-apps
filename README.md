# babel-plugin-transform-sitevision-apps

> Transform Sitevision Server Side Javascript.

[![CircleCI](https://circleci.com/gh/OlofFredriksson/babel-plugin-transform-sitevision-apps.svg?style=svg)](https://circleci.com/gh/OlofFredriksson/babel-plugin-transform-sitevision-apps)

## Webapps

- index.js
- main.js
- modules

See files in `test/` for ES6-ified Webapps files.

Sitevision Webapps file tree: https://developer.sitevision.se/docs/webapps/getting-started

## RestApps

TBD

# Usage

## Node Api

```
require("@babel/core").transform("your_code", {
  plugins: [["@babel/plugin-transform-sitevision-apps", options]]
});
```

## Options

### `type`

`string`, defaults to modules.

Sitevision file types, valid values:

- modules
- mainjs
- indexjs

# Development

```
$ npm install
$ npm run build
$ npm test
```
