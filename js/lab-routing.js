// Keep bookmarks to the former combined gallery working.
import { logos } from '../data/logos.js';

function routeCollection() {
  const hash = location.hash;
  if (hash === '#logos' || logos.some(logo => hash === `#mark-${logo.slug}`)) {
    location.replace(`/lab/logos/${location.search}${hash === '#logos' ? '' : hash}`);
  } else if (hash === '#web-projects') {
    location.replace(`/lab/websites/${location.search}#web-projects`);
  }
}
routeCollection();
addEventListener('hashchange', routeCollection);
