import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { PageShell } from "@/components/page-shell";
import { Badge, ArrowIcon } from "@/components/ui";
import { MediaPreview, Gallery } from "@/components/media";
import { Contact, ProjectFacts } from "@/components/sections";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const project = content.projects.find((project) => project.visible && project.slug === slug);
  return project ? { title: project.title, description: project.description } : {};
}

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const project = content.projects.find((project) => project.visible && project.slug === slug);
  if (!project) notFound();
  const contact = content.sections.find((section) => section.type === "contact" && section.visible);
  return <PageShell content={content}>
    <div className="container detail-page"><Link href="/projetos" className="back-link"><span aria-hidden="true">←</span>{content.ui.backToProjects}</Link><Badge>{project.tag}</Badge><h1 className="detail-title">{project.title}</h1><p className="detail-intro">{project.introduction}</p><div className="detail-presentation glass"><MediaPreview asset={project.presentation} ui={content.ui} presentation/></div><div className="detail-information"><ProjectFacts facts={project.facts}/><div className="project-story">{project.story.map((block) => <section key={block.title}><h2>{block.title}</h2><p>{block.text}</p></section>)}</div></div><Gallery assets={project.gallery} ui={content.ui}/><Link href="/projetos" className="text-link">{content.ui.backToProjects}<ArrowIcon/></Link></div>
    {contact?.type === "contact" && <Contact section={contact} email={content.contact.email}/>}
  </PageShell>;
}
