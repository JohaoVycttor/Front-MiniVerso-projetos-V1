
import {cache} from 'react';
import {homeDataDir} from './home-content';
import {readJson} from '@/shared/file-store.mjs';
import {normalizeSiteDocument,validateSiteDocument} from '@/shared/site-content.mjs';
import {contentApiConfig,publicApi} from '@/shared/content-client.mjs';
export const getSiteContent=cache(async()=>{
 const data=contentApiConfig().remote?await publicApi('/site-content/public'):normalizeSiteDocument(await readJson(homeDataDir(),'site-content.json'));
 return validateSiteDocument(data);
});
export async function getSitePage(id){const site=await getSiteContent();const page=site.pages.find(page=>page.id===id);if(!page)throw new Error('Página não cadastrada.');return {site,page};}
export const visibleSiteProjects=site=>site.projects.filter(project=>project.visible).sort((a,b)=>a.order-b.order);
