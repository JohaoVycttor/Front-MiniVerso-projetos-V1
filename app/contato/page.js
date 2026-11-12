import {getContent} from '@/lib/db';
import {defaultContact} from '@/lib/contact-content';
import ContactPageView from './ContactPageView';
import './contact-page.css';
export const dynamic='force-dynamic';
export const metadata={title:'Contato'};
export default async function ContactPage({searchParams}){
 const query=await searchParams;const data=await getContent();
 return <ContactPageView content={data.contactPage||defaultContact} initialSubject={typeof query.subject==='string'?query.subject:''} initialProject={typeof query.project==='string'?query.project:''}/>;
}
