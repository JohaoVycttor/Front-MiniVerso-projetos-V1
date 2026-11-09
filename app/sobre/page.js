import { getContent } from "@/lib/db";
import { defaultStudio } from "@/lib/studio-content";
import { getContent as getPortfolioContent, visibleProjects } from "@/lib/portfolio-content";
import StudioPage from "./StudioPage";
export const dynamic = "force-dynamic";
export const metadata = { title: "O estúdio" };
export default async function AboutPage() {
 const [data,portfolio] = await Promise.all([getContent(),getPortfolioContent()]);
 const projects=visibleProjects(portfolio.projects).map(({id,slug,title,tag,introduction,cover,presentation})=>({id,slug,title,tag,introduction,cover,presentation}));
 return <StudioPage content={data.studio || defaultStudio} projects={projects}/>;
}
