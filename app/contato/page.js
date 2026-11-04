import {getContent} from '@/lib/db';
import {defaultContact} from '@/lib/contact-content';
import {mergeContentDefaults} from '@/lib/content-defaults.js';
import ContactPageView from './ContactPageView';
import './contact-page.css';
export const dynamic='force-dynamic';
export async function generateMetadata(){
 const data=await getContent();
 const title=mergeContentDefaults(data.contactPage,defaultContact).pageTitle;
 return {title:title?title.charAt(0).toLocaleUpperCase('pt-BR')+title.slice(1):'Contato'};
}
export default async function ContactPage({searchParams}){
 const query=await searchParams;const data=await getContent();
 return <ContactPageView content={mergeContentDefaults(data.contactPage,defaultContact)} initialSubject={typeof query.subject==='string'?query.subject:''} initialProject={typeof query.project==='string'?query.project:''}/>;
}
