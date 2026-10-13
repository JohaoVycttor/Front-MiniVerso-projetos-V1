import { getContent } from "@/lib/db";
import { defaultStudio } from "@/lib/studio-content";
import StudioPage from "./StudioPage";
import "./studio-page.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "O estúdio" };
export default async function AboutPage() {
 const data = await getContent();
 return <StudioPage content={data.studio || defaultStudio}/>;
}
