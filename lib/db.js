import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "content.json");

export async function getContent(){ return JSON.parse(await fs.readFile(dbPath,"utf8")); }
export async function saveContent(data){ await fs.writeFile(dbPath,JSON.stringify(data,null,2)); return data; }
export async function addContact(contact){ const data=await getContent(); data.contacts.unshift({id:crypto.randomUUID(),createdAt:new Date().toISOString(),...contact}); await saveContent(data); }
export async function upsertItem(type,item){ const data=await getContent(); const list=data[type]; const clean={...item,id:item.id||crypto.randomUUID()}; const index=list.findIndex(x=>x.id===clean.id); if(index>=0) list[index]=clean; else list.unshift(clean); await saveContent(data); return clean; }
export async function deleteItem(type,id){ const data=await getContent(); data[type]=data[type].filter(x=>x.id!==id); await saveContent(data); }
