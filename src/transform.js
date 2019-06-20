import { declare } from "@babel/helper-plugin-utils";
import {
	isModule,
	rewriteModuleStatementsAndPrepareHeader,
	ensureStatementsHoisted,
} from "@babel/helper-module-transforms";
import { template } from "@babel/core";

const buildWrapper = template(`
  define(function(require) {
    var _exports = {};

    BODY

    return _exports; })
`);

export default declare((api, options) => {
	api.assertVersion(7);

	return {
		name: "transform-modules-sitevision",

		visitor: {
			Program: {
				exit(path) {
					if (!isModule(path)) return;

					const { headers } = rewriteModuleStatementsAndPrepareHeader(path, {
						loose: false,
						strict: false,
						strictMode: true,
						allowTopLevelThis: false,
						noInterop: true,
					});

					ensureStatementsHoisted(headers);
					path.unshiftContainer("body", headers);

					path.node.body = [
						buildWrapper({
							BODY: path.node.body,
						}),
					];
				},
			},
		},
	};
});
