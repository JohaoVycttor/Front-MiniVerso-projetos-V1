import {promises as fs} from 'fs';
import path from 'path';
const dbPath=path.join(process.cwd(),'data','content.json');
const queueKey=Symbol.for('miniverso.database.queue');
const revisions=new WeakMap();
function remoteUrl(){const url=process.env.CONTENT_API_URL;if(!url)return null;const parsed=new URL(url);if(!['https:','http:'].includes(parsed.protocol))throw new Error('Invalid content API URL');return parsed.toString()}
function headers(){const result={'Accept':'application/json'};if(process.env.CONTENT_API_TOKEN)result.Authorization='Bearer '+process.env.CONTENT_API_TOKEN;return result}
export async function getContent(){
 const endpoint=remoteUrl();
 if(!endpoint)return JSON.parse(await fs.readFile(dbPath,'utf8'));
 const response=await fetch(endpoint,{headers:headers(),cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw new Error('Content API read failed: '+response.status);
 const data=await response.json();if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Invalid content API response');
 if(response.headers.get('etag'))revisions.set(data,response.headers.get('etag'));
 return data;
}
async function write(data){
 const endpoint=remoteUrl();
 if(endpoint){
  const requestHeaders={...headers(),'Content-Type':'application/json'};const revision=revisions.get(data);if(revision)requestHeaders['If-Match']=revision;
  const response=await fetch(endpoint,{method:'PUT',headers:requestHeaders,body:JSON.stringify(data),cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(response.status===409||response.status===412){const error=new Error('Content changed in another session');error.code='CONTENT_CONFLICT';throw error}
  if(!response.ok)throw new Error('Content API write failed: '+response.status);
  return data;
 }
 const temporary=dbPath+'.'+crypto.randomUUID()+'.tmp';
 try{await fs.writeFile(temporary,JSON.stringify(data,null,2));await fs.rename(temporary,dbPath)}catch(error){await fs.unlink(temporary).catch(()=>{});throw error}
 return data;
}
export function updateContent(mutator){const pending=(globalThis[queueKey]||Promise.resolve()).then(async()=>{const data=await getContent();const result=await mutator(data);await write(data);return result});globalThis[queueKey]=pending.catch(()=>{});return pending}
export function saveContent(data){return updateContent(current=>{Object.keys(current).forEach(k=>delete current[k]);Object.assign(current,data);return data})}
export function addContact(contact){return updateContent(data=>{const item={id:crypto.randomUUID(),createdAt:new Date().toISOString(),...contact};data.contacts.unshift(item);return item})}
export function upsertItem(type,item){return updateContent(data=>{const list=data[type];const clean={...item,id:item.id||crypto.randomUUID()};const i=list.findIndex(x=>x.id===clean.id);if(i>=0)list[i]=clean;else list.unshift(clean);return clean})}
export function deleteItem(type,id){return updateContent(data=>{data[type]=data[type].filter(x=>x.id!==id)})}
