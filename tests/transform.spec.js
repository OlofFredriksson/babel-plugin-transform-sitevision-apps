import * as babel from "@babel/core";
import path from "path";
import fs from "fs";

const defaultConfig = {
	babelrc: false,
	plugins: [path.join(__dirname, "../src/transform")],
};

function compileSource(source, config) {
	const plugins = Object.assign({}, defaultConfig, config);
	const { code } = babel.transformSync(
		source,
		plugins
	);
	return code;
}

function compileFile(fileName, config) {
	const plugins = Object.assign({}, defaultConfig, config);
	const { code } = babel.transformFileSync(
		path.join(__dirname, fileName),
		plugins
	);
	return code;
}

describe('compiling source (static exports name)', () => {
	test("exported function", () => {
		const source = fs.readFileSync(path.join(__dirname, "fixtures/exported-function.js"), "utf-8");
		expect(compileSource(source)).toMatchSnapshot();
	});

	test("server module", () => {
		const source = fs.readFileSync(path.join(__dirname, "fixtures/server.module.js"), "utf-8");
		expect(compileSource(source)).toMatchSnapshot();
	});

	test("main.js", () => {
		const source = fs.readFileSync(path.join(__dirname, "fixtures/main.js"), "utf-8");
		const config = 	{
			plugins: [
				[ path.join(__dirname, "../src/transform"), {
					"type": "mainjs"
				}]
			]
		};
		expect(compileSource(source, config)).toMatchSnapshot();
	});
});

describe('compiling files (dynamic exports name)', () => {
	test("exported function", () => {
		expect(compileFile("fixtures/exported-function.js")).toMatchSnapshot();
	});
});
