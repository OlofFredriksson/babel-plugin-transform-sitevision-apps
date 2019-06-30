import * as babel from "@babel/core";
import path from "path";
import fs from "fs";

const encoding = "UTF-8";

const defaultConfig = {
	babelrc: false,
	plugins: [path.join(__dirname, "../src/transform")],
};

function compileSource(source, config) {
	const plugins = Object.assign({}, defaultConfig, config);
	const { code } = babel.transformSync(source, plugins);
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

describe("compiling source (static exports name)", () => {
	test("exported function", () => {
		const source = fs.readFileSync(
			path.join(__dirname, "fixtures/exported-function.js"),
			encoding
		);
		expect(compileSource(source)).toMatchSnapshot();
	});

	test("server module", () => {
		const source = fs.readFileSync(
			path.join(__dirname, "fixtures/server.module.js"),
			encoding
		);
		expect(compileSource(source)).toMatchSnapshot();
	});

	test("main.js", () => {
		const source = fs.readFileSync(
			path.join(__dirname, "fixtures/main.js"),
			encoding
		);
		const config = {
			plugins: [[path.join(__dirname, "../src/transform"), { type: "mainjs" }]],
		};
		expect(compileSource(source, config)).toMatchSnapshot();
	});

	test("index.js", () => {
		const source = fs.readFileSync(
			path.join(__dirname, "fixtures/index.js"),
			encoding
		);
		const config = {
			plugins: [
				[path.join(__dirname, "../src/transform"), { type: "indexjs" }],
			],
		};
		expect(compileSource(source, config)).toMatchSnapshot();
	});
});

describe("compiling files (dynamic exports name)", () => {
	test("exported function", () => {
		expect(compileFile("fixtures/exported-function.js")).toMatchSnapshot();
	});
});

describe("error handling", () => {
	test("should fail with invalid SV type", () => {
		const source = fs.readFileSync(
			path.join(__dirname, "fixtures/main.js"),
			encoding
		);
		const config = {
			plugins: [
				[path.join(__dirname, "../src/transform"), { type: "invalidType" }],
			],
		};
		expect(() => {
			compileSource(source, config);
		}).toThrow();
	});
});
