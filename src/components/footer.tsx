import Link from "next/link";
import { ArrowIcon, Brand } from "@/components/ui";
import type { PageContent } from "@/types/content";

export function Footer({ content }: { content: PageContent }) {
  return <footer className="site-footer">
    <div className="container">
      <div className="footer-top">
        <div className="footer-about"><Link href="/" aria-label={content.brand.name}><Brand brand={content.brand}/></Link><p>{content.brand.tagline}</p><div className="social-links">{content.footer.socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</div></div>
        <div className="footer-column"><p className="micro-label">{content.footer.exploreLabel}</p>{content.navigation.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</div>
        <div className="footer-column footer-contact"><p className="micro-label">{content.footer.contactLabel}</p><a href={`mailto:${content.contact.email}`}>{content.contact.email}<ArrowIcon/></a><p>{content.contact.location}</p><a href={`mailto:${content.contact.email}`}>{content.contact.actionLabel}<ArrowIcon/></a></div>
      </div>
      <Link href="/" className="footer-wordmark" aria-label={content.brand.name}><Brand brand={content.brand} large/></Link>
      <div className="footer-bottom"><span>{content.footer.copyright}</span><span>{content.footer.signature}</span><div>{content.footer.legalLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}</div></div>
    </div>
  </footer>;
}
