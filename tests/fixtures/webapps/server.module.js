import portletContextUtil from "PortletContextUtil";
import properties from "Properties";

export function getPropertyFromCurrentPage(prop) {
    return properties.get(portletContextUtil.getCurrentPage(), prop);
}

export function add(a, b) {
    return a + b;
}
