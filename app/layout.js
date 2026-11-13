
import './future.css';
import {getSiteContent} from '@/lib/site-content';
import {FutureHeader,FutureFooter} from '@/app/components/future/Frame';
import FutureInteractions from '@/app/components/future/Interactions';
export async function generateMetadata(){const {settings}=await getSiteContent();return {title:{default:settings.seoTitle,template:'%s | '+settings.brand},description:settings.seoDescription,icons:{icon:settings.favicon||'/favicon.svg'}};}
export default async function RootLayout({children}){const site=await getSiteContent();const pages=site.pages.map(({id,path,label})=>({id,path,label}));return <html lang="pt-BR" data-scroll-behavior="smooth"><body><a className="skip-link" href="#conteudo">{site.ui.skipLink}</a><FutureHeader settings={site.settings} pages={pages} ui={site.ui}/><FutureInteractions/><main id="conteudo">{children}</main><FutureFooter settings={site.settings} pages={pages} ui={site.ui}/></body></html>;}
