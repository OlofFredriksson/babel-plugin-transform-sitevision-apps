// From https://developer.sitevision.se/docs/webapps/pre-render-hooks

import { beforeRender, addHeadElement, getPageTitle } from "hooks";
import { getEventData } from "/module/server/eventsApi";
import { escape } from "underscore";

beforeRender((req) => {
    const data = getEventData(req.params.eventId);
    req.context.eventData = data; // req.context is propagated to the rendering phase (index.js)
});

getPageTitle((req) => req.context.eventData.title);

addHeadElement((req) => {
    const description = escape(req.context.eventData.description);
    return `<meta property="og:description" content="${description}">`;
});
