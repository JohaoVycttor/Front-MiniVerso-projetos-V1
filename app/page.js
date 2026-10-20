import {pageMetadata} from "@/lib/page-metadata";
import {getContent} from "@/lib/db";
import {homeContent} from "@/lib/site-content";
import HomePageView from "./components/HomePageView";
export const dynamic="force-dynamic";
export default async function Home(){const data=await getContent();return <HomePageView content={homeContent(data)} data={data}/>;}

export async function generateMetadata(){return pageMetadata("home")}
