import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { PageContent } from "@/types/content";

export function PageShell({ content, background, children }: { content: PageContent; background?: string; children: React.ReactNode }) {
  return <><Header content={content}/><main id="main" className={`project-world ${background ? "has-custom-background" : ""}`} style={{ "--scene-image": `url("${background ?? content.brand.background}")` } as React.CSSProperties}><div className="world-backdrop" aria-hidden="true"/>{children}</main><Footer content={content}/></>;
}
