import { declare } from "@babel/helper-plugin-utils";
import {
	isModule,
	rewriteModuleStatementsAndPrepareHeader,
	ensureStatementsHoisted,
} from "@babel/helper-module-transforms";
import { template } from "@babel/core";

const buildWrapper = template(`
  define(function(require) {
    var MODULE = {};

    BODY

    return MODULE_RETURN; })
`);

export default declare((api, options) => {
	api.assertVersion(7);

	const {
		loose,
		mainjs = false,
	} = options;
	return {
		name: "transform-modules-sitevision",

		visitor: {
			Program: {
				exit(path) {
					if (!isModule(path)) return;

					let module = '_exports';
					let moduleReturn = '_exports';

					if (mainjs) {
						moduleReturn = `${module}.default`;
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
