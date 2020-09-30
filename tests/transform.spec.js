import * as babel from "@babel/core";
import path from "path";
import fs from "fs";

const encoding = "UTF-8";
const pluginPath = "../src/transform";

const defaultConfig = {
	babelrc: false,
	plugins: [path.join(__dirname, pluginPath)],
};

function readFile(fileName) {
	return fs.readFileSync(path.join(__dirname, fileName), encoding);
}

function compileSource(source, config) {
	const effectiveConfig = Object.assign({}, defaultConfig, config);
	const { code } = babel.transformSync(source, effectiveConfig);
	return code;
}

function compileFile(fileName, config) {
	const effectiveConfig = Object.assign({}, defaultConfig, config);
	const { code } = babel.transformFileSync(
		path.join(__dirname, fileName),
		effectiveConfig
	);
	return code;
}

describe("compiling source (static exports name)", () => {
	test("exported function", () => {
		expect(
			compileSource(readFile("fixtures/exported-function.js"))
		).toMatchSnapshot();
	});

	test("server module", () => {
		expect(
			compileSource(readFile("fixtures/webapps/server.module.js"))
		).toMatchSnapshot();
	});

	test("main.js", () => {
		const config = {
			plugins: [[path.join(__dirname, pluginPath), { type: "mainjs" }]],
		};
		expect(
			compileSource(readFile("fixtures/webapps/main.js"), config)
		).toMatchSnapshot();
	});

	test("index.js", () => {
		const config = {
			plugins: [[path.join(__dirname, pluginPath), { type: "indexjs" }]],
		};
		expect(
			compileSource(readFile("fixtures/webapps/index.js"), config)
		).toMatchSnapshot();
	});

	test("hooks.js", () => {
		const config = {
			plugins: [[path.join(__dirname, pluginPath), { type: "indexjs" }]],
		};
		expect(
			compileSource(readFile("fixtures/webapps/hooks.js"), config)
		).toMatchSnapshot();
	});
});

describe("compiling files (dynamic exports name)", () => {
	test("exported function", () => {
		expect(compileFile("fixtures/exported-function.js")).toMatchSnapshot();
	});
	test("should rename internal function if same as fileName", () => {
		expect(compileFile("fixtures/sameNameAsFunction.js")).toMatchSnapshot();
	});
});

describe("error handling", () => {
	test("should fail with invalid SV type", () => {
		const config = {
			plugins: [[path.join(__dirname, pluginPath), { type: "invalidType" }]],
		};
		expect(() => {
			compileSource(readFile("fixtures/webapps/main.js"), config);
		}).toThrow();
	});
});
