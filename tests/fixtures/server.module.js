const portletContextUtil = require('PortletContextUtil');
const properties = require('Properties');

export function getPropertyFromCurrentPage(prop) {
	return properties.get(portletContextUtil.getCurrentPage(), prop);
};

export function add(a, b) {
	return a + b;
};
