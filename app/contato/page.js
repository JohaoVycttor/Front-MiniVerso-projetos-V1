import {getSitePage} from '@/lib/site-content';
import {FuturePage} from '@/app/components/future/Pages';
export const dynamic='force-dynamic';
export async function generateMetadata(){const {page}=await getSitePage('contact');return {title:{absolute:page.seoTitle},description:page.seoDescription}}
export default async function Page({searchParams}){const {site,page}=await getSitePage('contact');const query=await searchParams;return <FuturePage site={site} page={page} initialSubject={typeof query?.subject==='string'?query.subject:''}/>}