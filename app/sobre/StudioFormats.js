import SolutionsExplorer from '@/app/components/SolutionsExplorer';
import {EditorialHeading} from '@/app/components/Editorial';
import styles from '@/app/components/editorial.module.css';
export default function StudioFormats({section}){
 return <section className={styles.scope+' '+styles.section}><div className="studio-container"><EditorialHeading label={section.label} title={section.title} highlight={section.highlight} description={section.description}/><SolutionsExplorer compact items={section.cards}/></div></section>;
}
