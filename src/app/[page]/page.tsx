import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { PageShell } from "@/components/page-shell";
import { ArrowIcon, Eyebrow, Heading } from "@/components/ui";

type Props = { params: Promise<{ page: string }> };
export async function generateMetadata({ params }: Props) {
  const { page } = await params;
  const content = await getContent();
  const info = content.pages.find((item) => item.slug === page);
  return info ? { title: info.eyebrow, description: info.description } : {};
}
export default async function InformationPage({ params }: Props) {
  const { page } = await params;
  const content = await getContent();
  const info = content.pages.find((item) => item.slug === page);
  if (!info) notFound();
  return <PageShell content={content}><section className="container info-page"><Eyebrow>{info.eyebrow}</Eyebrow><Heading content={info.heading} as="h1"/><p className="hero-description">{info.description}</p><div className="info-blocks">{info.blocks.map((block) => <article className="glass" key={block.title}><h2>{block.title}</h2><p>{block.text}</p></article>)}</div><Link href="/projetos" className="button">{content.ui.backToProjects}<ArrowIcon/></Link></section></PageShell>;
}
