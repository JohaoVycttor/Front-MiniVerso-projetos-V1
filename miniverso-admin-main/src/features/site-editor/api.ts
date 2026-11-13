
import {adminRequest} from '@/lib/api/http';
import {unwrapData} from '@/lib/api/mappers';
import {validateSiteDocument,type SiteDocument} from './schema';
export async function getDocument(signal?:AbortSignal):Promise<SiteDocument>{return validateSiteDocument(unwrapData(await adminRequest('/pages',{signal})));}
export async function publishDocument(document:SiteDocument):Promise<SiteDocument>{return validateSiteDocument(unwrapData(await adminRequest('/pages',{method:'PUT',body:validateSiteDocument(document)})));}
