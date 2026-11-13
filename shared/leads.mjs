
import {randomUUID} from 'node:crypto';
import {readJson,updateJson} from './file-store.mjs';
export async function saveLead(directory,contact){
 const record={id:randomUUID(),name:contact.name,email:contact.email,phone:contact.phone||null,company:contact.company||null,message:contact.message,service:{id:contact.subject,title:contact.subject},consent:true,protocol:contact.protocol,created_at:new Date().toISOString()};
 await updateJson(directory,'leads.json',current=>[record,...current],[]);
 return record;
}
export async function readLeads(directory){return readJson(directory,'leads.json',[]);}
export async function removeLead(directory,id){
 let found=false;
 await updateJson(directory,'leads.json',current=>current.filter(lead=>{if(lead.id===id){found=true;return false;}return true;}),[]);
 return found;
}
