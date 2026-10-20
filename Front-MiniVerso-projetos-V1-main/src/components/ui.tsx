import type { Heading as HeadingContent, PageContent } from "@/types/content";

export function ArrowIcon({ className = "" }: { className?: string }) {
  return <svg className={className} width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M7 6h11v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function ImageIcon() {
  return <svg width="31" height="31" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="3" y="5" width="26" height="22" rx="4" stroke="currentColor" strokeWidth="1.7"/><circle cx="11" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="m5 24 8-8 5 5 4-4 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
}
export function PlayIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 6 9 6-9 6V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
}
export function Brand({ brand, large = false }: { brand: PageContent["brand"]; large?: boolean }) {
  return <span className={`brand ${large ? "brand-large" : ""}`}><img src={brand.logo} alt="" width={176} height={104}/><span>{brand.name}</span></span>;
}
export function Heading({ content, as = "h2", className = "" }: { content: HeadingContent; as?: "h1" | "h2"; className?: string }) {
  const Tag = as;
  return <Tag className={`display-heading ${className}`}>{content.text} <em>{content.accent}</em></Tag>;
}
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge"><span className="badge-dot"/>{children}</span>;
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">[ {children} ]</p>;
}
