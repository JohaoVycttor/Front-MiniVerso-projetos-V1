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
export function ArrowRightIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export function ChevronLeftIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export function ShieldIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6l-7-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export function HeadsetIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3.5l-2-2.5h-3l-2 2.5H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
}
export function ChartIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h16M8 16v-4m4 4V8m4 8v-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
}
export function VrIcon() {
  return <svg className="vr-icon" viewBox="0 0 132 56" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="6" y="2" width="120" height="46" rx="13"/><path d="M1 18h10m110 0h10"/><ellipse cx="42" cy="24" rx="19" ry="14"/><ellipse cx="90" cy="24" rx="19" ry="14"/><path d="M66 16v16m-7 16 7 7 7-7"/></g></svg>;
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
