import styles from './solutions-explorer.module.css';

export default function NeonFormat({format,titleId,label}) {
 return <svg className={styles.neonDiagram} viewBox="0 0 600 390" role="img" aria-labelledby={titleId} data-format={format}>
  <title id={titleId}>{label} — diagrama animado em linhas neon</title>
  <g className={styles.floor}><path d="m90 285 210-105 210 105-210 100Z M140 285l160-80 160 80-160 80Z"/></g>
  {format==='ar'?<>
   <g className={styles.cube}><path d="m300 95 90 50v105l-90 52-90-52V145Z M210 145l90 52 90-52 M300 197v105"/></g>
   <g className={styles.scan}><path d="m190 205 110-60 110 60-110 63Z"/></g>
   <path className={styles.connector} d="M300 302v45 M210 125l-50-45 M390 125l50-45"/>
   <text x="80" y="58">AR / CAMADA DIGITAL</text><text x="360" y="367">SEU ESPAÇO REAL</text>
  </>:format==='mr'?<>
   <g className={styles.realCube}><path d="m220 155 85 47v96l-85 49-85-49v-96Z M135 202l85 49 85-49 M220 251v96"/></g>
   <g className={styles.mixedCube}><path d="m340 75 85 47v96l-85 49-85-49v-96Z M255 122l85 49 85-49 M340 171v96"/></g>
   <path className={styles.connector} d="m220 155 120-80 M305 298l120-80"/>
   <text x="65" y="65">MR / DOIS MUNDOS</text><text x="350" y="367">UMA INTERAÇÃO</text>
  </>:<>
   <g className={styles.globe}><ellipse cx="300" cy="190" rx="160" ry="132"/><ellipse className={styles.meridian} cx="300" cy="190" rx="80" ry="132"/><ellipse cx="300" cy="190" rx="160" ry="48"/><path d="M140 190h320 M300 58v264"/></g>
   <g className={styles.orbit}><ellipse cx="300" cy="190" rx="205" ry="70"/><circle cx="505" cy="190" r="5"/></g>
   <text x="264" y="200" className={styles.neonDegree}>360°</text><text x="160" y="35">EXPLORE EM TODAS AS DIREÇÕES</text>
  </>}
  <path className={styles.brackets} d="M90 105V80h25 M485 80h25v25 M90 305v25h25 M510 305v25h-25"/>
 </svg>;
}