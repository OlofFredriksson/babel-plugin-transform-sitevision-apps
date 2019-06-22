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

const sitevisionServerJsTypes = {
	modules: "modules",
	mainjs: "mainjs",
	index: "indexjs", // not supported yet
};

const loose = false;

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
					}

					const { meta, headers } = rewriteModuleStatementsAndPrepareHeader(
						path,
						{
							exportName: module,
							loose: loose,
							strict: true,
							strictMode: false,
							allowTopLevelThis: false,
							noInterop: true,
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
							  }
							`;
							} else {
								header = template.ast`
							  var ${metadata.name} = ${init};
							`;
							}
						}
						header.loc = metadata.loc;

						headers.push(header);
						headers.push(
							...buildNamespaceInitStatements(meta, metadata, loose)
						);
					}

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
