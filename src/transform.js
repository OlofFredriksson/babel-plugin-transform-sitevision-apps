import { declare } from "@babel/helper-plugin-utils";
import {
	isModule,
	rewriteModuleStatementsAndPrepareHeader,
	ensureStatementsHoisted,
} from "@babel/helper-module-transforms";
import { template } from "@babel/core";

const nodePath = require('path');

const buildWrapper = template(`
  define(function(require) {
    var MODULE = {};

    BODY

    return MODULE_RETURN; })
`);

const sitevisionServerJsTypes = {
	modules: "modules",
	mainjs: "mainjs",
	index: "indexjs" // not supported yet
  };

export default declare((api, options) => {
	api.assertVersion(7);

	const {
		type = sitevisionServerJsTypes.modules
	} = options;
	return {
		name: "transform-modules-sitevision",

		visitor: {
			Program: {
				exit(path) {
					if (!isModule(path)) return;

					let module;
					let moduleReturn;
					if (this.file.opts.filename) {
						module = nodePath.parse(this.file.opts.filename).name.replace(/[\W_]/g,"");;
					}
					else {
						module = '_exports';
					}

					switch (type) {
					case sitevisionServerJsTypes.mainjs:
						moduleReturn = `${module}.default`;
						break;
					case sitevisionServerJsTypes.modules:
						moduleReturn = module;
						break;
					}

					const { headers } = rewriteModuleStatementsAndPrepareHeader(path, {
						loose: false,
						strict: true,
						strictMode: true,
						allowTopLevelThis: false,
						noInterop: true,
					});

					ensureStatementsHoisted(headers);
					path.unshiftContainer("body", headers);

					path.node.body = [
						buildWrapper({
							MODULE: module,
							MODULE_RETURN: moduleReturn,
							BODY: path.node.body,
						}),
					];
				},
			},
		},
	};
});
