import Link from "next/link";
import { ArrowIcon, ArrowRightIcon, ChartIcon, Eyebrow, HeadsetIcon, ShieldIcon } from "@/components/ui";
import type { PageContent, Project, ProjectHighlight } from "@/types/content";

const highlightIcons = { shield: ShieldIcon, headset: HeadsetIcon, chart: ChartIcon };

export function ProjectStory({ story }: { story: Project["story"] }) {
  return <div className="project-story">{story.map((block) => <section key={block.title}>{block.label && <Eyebrow>{block.label}</Eyebrow>}<h2>{block.title}</h2><p>{block.text}</p></section>)}</div>;
}

export function ProjectHighlights({ highlights, label }: { highlights: ProjectHighlight[]; label: string }) {
  return <section className="project-highlights" aria-label={label}>
    <Eyebrow>{label}</Eyebrow>
    <div className="highlight-grid">{highlights.map((item) => {
      const Icon = highlightIcons[item.icon];
      return <article key={item.title} className="highlight-card glass"><span className="highlight-icon"><Icon/></span><h3>{item.title}</h3><p>{item.text}</p></article>;
    })}</div>
  </section>;
}

export function NextProject({ project, label }: { project: Project; label: string }) {
  return <Link href={`/projetos/${project.slug}`} className="next-project glass">
    <div><p className="micro-label">{label}</p><h2>{project.title}</h2><p className="next-tag">{project.tag}</p></div>
    <span className="next-arrow"><ArrowRightIcon/></span>
  </Link>;
}

export function ProjectContact({ ui, email }: { ui: PageContent["ui"]; email: string }) {
  return <section className="project-contact"><div className="container project-contact-inner"><h2>{ui.projectContactTitle}</h2><a className="glass-button" href={`mailto:${email}`}>{ui.projectContactAction}<ArrowIcon/></a></div></section>;
}
