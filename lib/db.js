import { promises as fs } from "fs";
import path from "path";
import { getStore } from "@netlify/blobs";

const dbPath = path.join(process.cwd(), "data", "content.json");
const cloudContacts = () => process.env.MINIVERSO_CONTACT_STORAGE === "netlify";
const contactStore = () => getStore({name:"miniverso-contacts",consistency:"strong"});

export async function getContent(){ return JSON.parse(await fs.readFile(dbPath,"utf8")); }
export async function saveContent(data){ await fs.writeFile(dbPath,JSON.stringify(data,null,2)); return data; }
export async function addContact(contact){ const record={...contact,id:crypto.randomUUID(),createdAt:new Date().toISOString()};if(cloudContacts()){await contactStore().setJSON(record.id,record);return record;}const data=await getContent();data.contacts.unshift(record);await saveContent(data);return record; }
export async function getAdminContent(){const data=await getContent();if(!cloudContacts())return data;const store=contactStore();const {blobs}=await store.list();const records=await Promise.all(blobs.map(blob=>store.get(blob.key,{type:"json"})));return {...data,contacts:[...records.filter(Boolean),...(data.contacts||[])].sort((a,b)=>b.createdAt.localeCompare(a.createdAt))};}
export async function upsertItem(type,item){ const data=await getContent(); const list=data[type]; const clean={...item,id:item.id||crypto.randomUUID()}; const index=list.findIndex(x=>x.id===clean.id); if(index>=0) list[index]=clean; else list.unshift(clean); await saveContent(data); return clean; }
export async function deleteItem(type,id){ const data=await getContent(); data[type]=data[type].filter(x=>x.id!==id); await saveContent(data); }
