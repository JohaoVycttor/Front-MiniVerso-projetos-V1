import { getContent } from "@/lib/content";
import { PageShell } from "@/components/page-shell";
import { SectionRenderer } from "@/components/sections";

export async function generateMetadata() {
  const content = await getContent();
  return { title: { absolute: content.metadata.title }, description: content.metadata.description };
}

export default async function Home() {
  const content = await getContent();
  return <PageShell content={content}><SectionRenderer content={content}/></PageShell>;
}
