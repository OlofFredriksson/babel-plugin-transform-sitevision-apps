# babel-plugin-transform-sitevision-apps

> Transform Sitevision Server Side Javascript.

**Only for application build in the old / legacy way**
If you are building applications in the "bundled" mode, this plugin is not needed.

Read more about bundled apps here:
https://developer.sitevision.se/archives/developer-news/developer-news/2021-06-10-bundled-apps

[![Build](https://github.com/OlofFredriksson/babel-plugin-transform-sitevision-apps/workflows/Build/badge.svg)](https://github.com/OlofFredriksson/babel-plugin-transform-sitevision-apps/actions)
[![npm](https://img.shields.io/npm/v/babel-plugin-transform-sitevision-apps)](https://www.npmjs.com/package/babel-plugin-transform-sitevision-apps)

## Webapps & Restapps

Sitevision Webapps file tree: https://developer.sitevision.se/docs/webapps/getting-started

-   index.js
-   main.js
-   modules
-   Pre render hooks (introduced in SV: 6.2)

See files in `test/` for ES6-ified files.

# Usage

`npm install --save-dev babel-plugin-transform-sitevision-apps`

## Node Api

```
require("@babel/core").transform("your_code", {
  plugins: [["@babel/plugin-transform-sitevision-apps", options]]
});
```

## Type Schema

| Sitevision File     | Type    |
| ------------------- | ------- |
| index.js            | indexjs |
| config/\*/index.js  | indexjs |
| hooks.js            | indexjs |
| main.js             | mainjs  |
| server/module/\*.js | modules |

## Options

### `type`

`string`, defaults to `modules`.

See Type Schema for valid values.

# Development

```
$ npm install
$ npm run build
$ npm test
```
