import {getContent} from './db';
import {siteContent} from './site-content';
export async function pageMetadata(page){const settings=siteContent(await getContent());return settings.pages[page]||{}}
