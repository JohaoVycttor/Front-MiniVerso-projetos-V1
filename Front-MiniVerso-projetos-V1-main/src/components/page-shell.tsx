import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { PageContent } from "@/types/content";

export function PageShell({ content, children }: { content: PageContent; children: React.ReactNode }) {
  return <><Header content={content}/><main id="main" className="project-world" style={{ "--scene-image": `url("${content.brand.background}")` } as React.CSSProperties}><div className="world-backdrop" aria-hidden="true"/>{children}</main><Footer content={content}/></>;
}
