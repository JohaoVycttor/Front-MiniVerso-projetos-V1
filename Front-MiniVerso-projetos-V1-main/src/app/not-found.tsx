import Link from "next/link";
import mockContent from "@/data/content.json";

export default function NotFound() {
  return <main className="fallback-page"><p className="eyebrow">404</p><h1>{mockContent.ui.notFoundTitle}</h1><p>{mockContent.ui.notFoundDescription}</p><Link href="/projetos" className="button">{mockContent.ui.backToProjects}</Link></main>;
}
