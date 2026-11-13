
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
export async function readJson(directory,name,fallback){
 try{return JSON.parse(await fs.readFile(path.join(directory,name),'utf8'));}
 catch(error){if(error.code==='ENOENT'&&fallback!==undefined)return structuredClone(fallback);throw error;}
}
export async function updateJson(directory,name,edit,fallback){
 await fs.mkdir(directory,{recursive:true});
 const lockPath=path.join(directory,name+'.lock');
 let lock;
 for(let attempt=0;attempt<100;attempt++){
  try{lock=await fs.open(lockPath,'wx');break;}
  catch(error){if(error.code!=='EEXIST')throw error;const stat=await fs.stat(lockPath).catch(()=>null);if(stat&&Date.now()-stat.mtimeMs>120000)await fs.unlink(lockPath).catch(()=>{});await new Promise(resolve=>setTimeout(resolve,50));}
 }
 if(!lock)throw new Error('Há outra publicação em andamento. Tente novamente.');
 let temporary;
 try{
  const next=await edit(await readJson(directory,name,fallback));
  temporary=path.join(directory,name+'.'+randomUUID()+'.tmp');
  await fs.writeFile(temporary,JSON.stringify(next,null,2)+'\n',{flag:'wx'});
  await fs.rename(temporary,path.join(directory,name));
  return next;
 }finally{
  if(temporary)await fs.unlink(temporary).catch(()=>{});
  await lock.close();await fs.unlink(lockPath).catch(()=>{});
 }
}
