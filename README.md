# babel-plugin-transform-modules-sitevision

Transform Sitevision Server Side Javascript.

- index.js
- main.js
- modules

See files in `test/` for ES6-ified Sitevision files.

Sitevision Webapps file tree: https://developer.sitevision.se/docs/webapps/getting-started

# Usage

## Node Api

```
require("@babel/core").transform("your_code", {
  plugins: [["@babel/plugin-transform-modules-sitevision", options]]
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
