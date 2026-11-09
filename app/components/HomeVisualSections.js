import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import HomeDevices, { HomePhones } from "./HomeDevices";
import styles from "./home-visual.module.css";

const text = value => typeof value === "string" ? value : "";
const safeUrl = value => typeof value === "string" && ((value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) || /^https?:\/\//i.test(value)) ? value : "";

function Heading({ fields }) {
  return <div className={styles.heading} data-home-reveal>
    <span className={styles.eyebrow}>{text(fields.eyebrow)}</span>
    <h2 id={fields.headingId}>{text(fields.title)}{fields.highlight && <><br/><em>{text(fields.highlight)}</em></>}</h2>
  </div>;
}

function Action({ fields, fallback }) {
  const href = safeUrl(fields.buttonUrl) || fallback;
  return href && fields.buttonLabel ? <Link className={styles.action} href={href}>{text(fields.buttonLabel)}<ArrowUpRight size={17} aria-hidden="true"/></Link> : null;
}

function History({ fields }) {
  return <>
    <div className={`shell ${styles.intro}`}>
      <Heading fields={fields}/>
      <div className={styles.introCopy} data-home-reveal>
        <p>{text(fields.text).split(/\n\s*\n/).filter(Boolean)[0]}</p>
        <Action fields={fields} fallback="/sobre"/>
      </div>
    </div>
    <HomeDevices/>
  </>;
}

function Solutions({ fields, items }) {
  return <>
    <div className={`shell ${styles.sectionTop}`}><Heading fields={fields}/><Action fields={fields} fallback="/servicos"/></div>
    <HomePhones/>
    <div className={`shell ${styles.solutionIndex}`}>
      {items.map((item, index) => <Link key={item.id} href={safeUrl(item.link) || "/servicos"}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span><span>{text(item.title)}</span><ArrowUpRight size={16} aria-hidden="true"/></Link>)}
    </div>
  </>;
}

function Projects({ fields, items }) {
  const projects = [...items].sort((a, b) => Number(b.id === fields.featured) - Number(a.id === fields.featured));
  return <>
    <div className={`shell ${styles.sectionTop}`}><Heading fields={fields}/><Action fields={fields} fallback="/projetos"/></div>
    <div className={`shell ${styles.projects}`}>
      {projects.map((item, index) => {
        const href = safeUrl(item.link) || `/home-projects/${encodeURIComponent(item.id)}`;
        return <article className={styles.project} key={item.id} data-home-reveal>
          <Link href={href} className={styles.projectLink}>
            <span className={styles.projectNumber} aria-hidden="true">/ {String(index + 1).padStart(2, "0")}</span>
            <div className={styles.projectCopy}>
              <span className={styles.projectCategory}>{text(item.category)}</span>
              <h3>{text(item.name)}</h3>
              {item.summary && <p>{text(item.summary)}</p>}
            </div>
            <span className={styles.projectArrow} aria-hidden="true"><ArrowUpRight size={20}/></span>
          </Link>
        </article>;
      })}
    </div>
  </>;
}

function Values({ fields, items }) {
  return <div className={styles.values} data-home-reveal>
    <div><Heading fields={fields}/>{fields.statement && <p className={styles.statement}>{text(fields.statement)}</p>}<Link href="/sobre" className={styles.action}>Conheça o que nos move<ArrowUpRight size={17} aria-hidden="true"/></Link></div>
    <div className={styles.valuesVisual}>
      <div className={styles.valueWords}>{items.map(item => <span key={item.id}>{text(item.title)}</span>)}</div>
    </div>
  </div>;
}

function Process({ fields, items }) {
  return <>
    <div className={styles.sectionTop}><Heading fields={fields}/><Link href="/contato" className={styles.action}>Vamos dar o primeiro passo<ArrowUpRight size={17} aria-hidden="true"/></Link></div>
    <div className={styles.process}>{items.map((item, index) => <article key={item.id} data-home-reveal>
      <div className={styles.processTop}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span></div>
      <h3>{text(item.title)}</h3><p>{text(item.description)}</p>
    </article>)}</div>
  </>;
}

const sections = { sobre: History, servicos: Solutions, projetos: Projects, diferenciais: Values, processo: Process };
export const visualSectionKeys = Object.keys(sections);

export default function HomeVisualSection({ section, media }) {
  const Component = sections[section.key];
  const wide = ["sobre", "servicos", "projetos"].includes(section.key);
  const light = false;
  return <section id={section.key} className={`${styles.section}${light ? ` ${styles.light}` : ""}${section.key === "projetos" ? ` ${styles.gallerySection}` : ""}`} data-home-theme={light ? "light" : "dark"} aria-labelledby={`${section.key}-visual-heading`}>
    <div className={wide ? styles.fullWidth : "shell"}><div className={styles.sectionContent}><Component fields={{ ...section.fields, headingId: `${section.key}-visual-heading` }} items={section.items.filter(item => item.visible !== false)}/></div></div>
  </section>;
}
