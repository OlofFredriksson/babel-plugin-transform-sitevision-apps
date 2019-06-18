import * as babel from "@babel/core";
import path from "path";
import fs from "fs";

const defaultConfig = {
	babelrc: false,
	plugins: [path.join(__dirname, "../src/transform")],
};

function compile(filename, config) {
	const source = fs.readFileSync(path.join(__dirname, filename), "utf-8");
	const { code } = babel.transform(
		source,
		Object.assign({}, defaultConfig, config)
	);
	return code;
}

test("exported function", () => {
	expect(compile("fixtures/exported-function.js")).toMatchSnapshot();
});
