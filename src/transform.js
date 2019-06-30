import { declare } from "@babel/helper-plugin-utils";
import {
	isModule,
	rewriteModuleStatementsAndPrepareHeader,
	buildNamespaceInitStatements,
	isSideEffectImport,
	ensureStatementsHoisted,
	wrapInterop,
} from "@babel/helper-module-transforms";
import { template, types as t } from "@babel/core";

const nodePath = require("path");

const buildWrapper = template(`
  define(function(require) {
    var MODULE = {};

    BODY

    return MODULE_RETURN; })
`);

const buildWrapperIndex = template(`
  (function() {
    'use strict';

    BODY

  }());
`);

// See https://babeljs.io/docs/en/next/babel-plugin-transform-modules-commonjs.html
// for more info
const defaults = {
	loose: false,
	strict: true,
	strictMode: false,
	allowTopLevelThis: false,
	noInterop: false,
};

// Only supporting server redendering JS.
// Se https://developer.sitevision.se/docs/webapps/getting-started for different types of files
const sitevisionServerJsTypes = {
	modules: "modules",
	mainjs: "mainjs",
	indexjs: "indexjs", // not supported yet
};

export default declare((api, options) => {
	api.assertVersion(7);

	const { type = sitevisionServerJsTypes.modules } = options;
	return {
		name: "transform-modules-sitevision",

		visitor: {
			Program: {
				exit(path) {
					if (!isModule(path)) return;
					path.scope.rename("exports");
					path.scope.rename("module");
					path.scope.rename("require");

					let module;
					let moduleReturn;
					if (this.file.opts.filename) {
						module = nodePath
							.parse(this.file.opts.filename)
							.name.replace(/[\W_]/g, "");
					} else {
						module = "_exports";
					}

					switch (type) {
						case sitevisionServerJsTypes.mainjs:
							moduleReturn = `${module}.default`;
							break;
						case sitevisionServerJsTypes.modules:
							moduleReturn = module;
							break;
						case sitevisionServerJsTypes.indexjs:
							module = ""; // Not relevant
							moduleReturn = ""; // Not relevant
							break;
						default:
							throw new Error(`Specify correct SV file type`);
					}

					const { meta, headers } = rewriteModuleStatementsAndPrepareHeader(
						path,
						{
							exportName: module,
							loose: defaults.loose,
							strict: defaults.strict,
							strictMode: defaults.strictMode,
							allowTopLevelThis: defaults.allowTopLevelThis,
							noInterop: defaults.noInterop,
						}
					);

					for (const [source, metadata] of meta.source) {
						const loadExpr = t.callExpression(t.identifier("require"), [
							t.stringLiteral(source),
						]);

						let header;
						if (isSideEffectImport(metadata)) {
							if (metadata.lazy) throw new Error("Assertion failure");

							header = t.expressionStatement(loadExpr);
						} else {
							const init =
								wrapInterop(path, loadExpr, metadata.interop) || loadExpr;

							if (metadata.lazy) {
								header = template.ast`
								function ${metadata.name}() {
									const data = ${init};
									${metadata.name} = function(){ return data; };
									return data;
								}`;
							} else {
								header = template.ast`
									var ${metadata.name} = ${init};
								`;
							}
						}
						header.loc = metadata.loc;

						headers.push(header);
						headers.push(
							...buildNamespaceInitStatements(meta, metadata, defaults.loose)
						);
					}

					ensureStatementsHoisted(headers);
					path.unshiftContainer("body", headers);

					if (options.type === sitevisionServerJsTypes.indexjs) {
						path.node.body = [
							buildWrapperIndex({
								BODY: path.node.body,
							}),
						];
					} else {
						path.node.body = [
							buildWrapper({
								MODULE: module,
								MODULE_RETURN: moduleReturn,
								BODY: path.node.body,
							}),
						];
					}
				},
			},
		},
	};
});
