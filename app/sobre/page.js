import {pageMetadata} from "@/lib/page-metadata";
﻿import { getContent } from "@/lib/db";
import { defaultStudio } from "@/lib/studio-content";
import StudioPage from "./StudioPage";
import "./studio-page.css";
export const dynamic = "force-dynamic";

export default async function AboutPage() {
 const data = await getContent();
 return <StudioPage content={data.studio || defaultStudio}/>;
}

export async function generateMetadata(){return pageMetadata("studio")}
