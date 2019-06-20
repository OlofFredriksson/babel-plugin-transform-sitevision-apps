import * as babel from "@babel/core";
import path from "path";
import fs from "fs";

const defaultConfig = {
	babelrc: false,
	plugins: [path.join(__dirname, "../src/transform")],
};

function compile(filename, config) {
	const source = fs.readFileSync(path.join(__dirname, filename), "utf-8");

	const plugins = Object.assign({}, defaultConfig, config);
	console.log(plugins);
	const { code } = babel.transform(
		source,
		plugins
	);
	return code;
}

test("exported function", () => {
	expect(compile("fixtures/exported-function.js")).toMatchSnapshot();
});

test("server module", () => {
	expect(compile("fixtures/server.module.js")).toMatchSnapshot();
});

test("main.js", () => {
	const config = 	{
		plugins: [
			[ path.join(__dirname, "../src/transform"), {
				"mainjs": true
			}]
		]
	};
	expect(compile("fixtures/main.js", config)).toMatchSnapshot();
});
