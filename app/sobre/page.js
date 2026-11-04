import { getContent } from "@/lib/db";
import { defaultStudio } from "@/lib/studio-content";
import { mergeContentDefaults } from "@/lib/content-defaults.js";
import { getContent as getPortfolioContent, visibleProjects } from "@/lib/portfolio-content";
import StudioPage from "./StudioPage";
import "./studio-page.css";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
 const data=await getContent();
 const title=mergeContentDefaults(data.studio,defaultStudio).pageTitle;
 return {title:title?title.charAt(0).toLocaleUpperCase('pt-BR')+title.slice(1):'O estúdio'};
}
export default async function AboutPage() {
 const [data,portfolio] = await Promise.all([getContent(),getPortfolioContent()]);
 const projects=visibleProjects(portfolio.projects).map(({id,slug,title,tag,introduction,cover,presentation})=>({id,slug,title,tag,introduction,cover,presentation}));
 return <StudioPage content={mergeContentDefaults(data.studio,defaultStudio)} projects={projects}/>;
}
