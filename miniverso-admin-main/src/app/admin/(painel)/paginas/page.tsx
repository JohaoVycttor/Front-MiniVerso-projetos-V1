
import type {Metadata} from 'next';
import {SiteEditor} from '@/features/site-editor/site-editor';
import {publicConfig} from '@/lib/public-config';
export const metadata:Metadata={title:'Conteúdo do site'};
export default function PagesEditor(){return <SiteEditor siteUrl={process.env.SITE_URL||publicConfig.siteUrl}/>;}
