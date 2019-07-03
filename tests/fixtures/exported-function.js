export function foo(a, b) {
	return a + b + internalFunction(a);
}

function internalFunction(a) {
	return a;
}
