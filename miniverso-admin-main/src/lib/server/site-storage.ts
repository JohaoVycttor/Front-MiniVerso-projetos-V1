
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {homeDataDir} from './home-storage';
import {updateJson} from '../../../../shared/file-store.mjs';
import {normalizeSiteDocument} from '../../../../shared/site-content.mjs';
import {validateSiteDocument,type SiteDocument} from '@/features/site-editor/schema';
export class SiteConflictError extends Error{constructor(){super('Outra sessão publicou alterações. Recarregue o conteúdo antes de publicar novamente.');}}
export async function readSite():Promise<SiteDocument>{return validateSiteDocument(normalizeSiteDocument(JSON.parse(await fs.readFile(path.join(homeDataDir(),'site-content.json'),'utf8'))));}
let publishing:Promise<unknown>=Promise.resolve();
export function publishSite(value:unknown):Promise<SiteDocument>{
 const validated=structuredClone(validateSiteDocument(value));
 const task=publishing.then(()=>updateJson(homeDataDir(),'site-content.json',(raw:unknown)=>{const current=validateSiteDocument(normalizeSiteDocument(raw));if(current.revision!==validated.revision)throw new SiteConflictError();return {...validated,revision:current.revision+1,publishedAt:new Date().toISOString()};}));
 publishing=task.catch(()=>{});return task;
}
