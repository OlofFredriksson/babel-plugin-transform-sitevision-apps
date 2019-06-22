import * as portletContextUtil from "PortletContextUtil";
import * as properties from "Properties";

export function getPropertyFromCurrentPage(prop) {
	return properties.get(portletContextUtil.getCurrentPage(), prop);
}

export function add(a, b) {
	return a + b;
}
