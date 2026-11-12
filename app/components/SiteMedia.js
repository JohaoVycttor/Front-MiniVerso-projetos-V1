import Image from 'next/image';
import styles from './visual-content.module.css';

export default function SiteMedia({src,alt='',caption,className='',sizes='(max-width: 760px) 90vw, 45vw'}) {
  if (!src) return null;
  return <figure className={`${styles.media} ${className}`}><div className={styles.photo}><Image src={src} alt={alt} fill sizes={sizes} unoptimized={!src.startsWith('/')}/></div>{caption&&<figcaption>{caption}</figcaption>}</figure>;
}
