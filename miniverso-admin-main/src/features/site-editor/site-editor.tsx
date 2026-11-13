
"use client";
import {useEffect,useMemo,useState} from 'react';
import {Button} from '@/components/ui/button';
import {Alert} from '@/components/ui/alert';
import {PageFields} from './page-fields';
import {ProjectFields} from './project-fields';
import {GlobalFields,DigitalFields} from './global-fields';
import {getDocument,publishDocument} from './api';
import {MediaActivityContext} from './controls';
import {validateSiteDocument,type SiteDocument} from './schema';
import styles from './site-editor.module.css';

export function SiteEditor({siteUrl}:{siteUrl:string}){
 const [published,setPublished]=useState<SiteDocument|null>(null);
 const [draft,setDraft]=useState<SiteDocument|null>(null);
 const [selected,setSelected]=useState('home');
 const [error,setError]=useState('');
 const [success,setSuccess]=useState('');
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState(false);
 const [uploads,setUploads]=useState(0);
 const [reload,setReload]=useState(0);
 const dirty=useMemo(()=>Boolean(draft&&published&&JSON.stringify(draft)!==JSON.stringify(published)),[draft,published]);
 useEffect(()=>{
  const controller=new AbortController();
  getDocument(controller.signal).then(value=>{setPublished(value);setDraft(structuredClone(value));setLoading(false);}).catch(cause=>{if(!controller.signal.aborted){setError(cause instanceof Error?cause.message:'Não foi possível carregar o conteúdo.');setLoading(false);}});
  return()=>controller.abort();
 },[reload]);
 useEffect(()=>{if(!dirty)return;const warn=(event:BeforeUnloadEvent)=>event.preventDefault();addEventListener('beforeunload',warn);return()=>removeEventListener('beforeunload',warn);},[dirty]);
 function change(next:SiteDocument){setDraft(next);setSuccess('');}
 async function save(){
  if(!draft||saving||uploads>0)return;
  setError('');setSuccess('');
  try{validateSiteDocument(draft);}catch(cause){setError(cause instanceof Error?cause.message:'Revise os campos.');return;}
  setSaving(true);
  try{const value=await publishDocument(draft);setPublished(value);setDraft(structuredClone(value));setSuccess('Conteúdo publicado. As páginas passam a ler esta versão sem novo build.');}
  catch(cause){setError((cause instanceof Error?cause.message:'Não foi possível publicar.')+' Seu rascunho foi preservado.');}
  finally{setSaving(false);}
 }
 if(loading)return <p role="status">Carregando o conteúdo das páginas…</p>;
 if(!draft||!published)return <Alert tone="error" title="Conteúdo indisponível" action={<Button onClick={()=>{setLoading(true);setError('');setReload(value=>value+1);}}>Tentar novamente</Button>}>{error}</Alert>;
 const page=draft.pages.find(entry=>entry.id===selected);
 return <MediaActivityContext.Provider value={delta=>setUploads(count=>Math.max(0,count+delta))}><div className={styles.editor}>
  <div className={styles.top}><div><h1>Conteúdo do site</h1><p>Gerencie páginas, imagens, projetos, contatos e informações compartilhadas.</p></div><div className={styles.actions}><Button variant="secondary" disabled={saving||uploads>0} onClick={()=>{if(!dirty||confirm('Recarregar e descartar o rascunho atual?')){setLoading(true);setError('');setSuccess('');setReload(value=>value+1);}}}>Recarregar</Button><Button variant="secondary" disabled={!dirty||saving||uploads>0} onClick={()=>{if(confirm('Descartar todas as alterações não publicadas?')){setDraft(structuredClone(published));setError('');setSuccess('');}}}>Descartar</Button><Button loading={saving} disabled={!dirty||saving||uploads>0} onClick={save}>Salvar e publicar</Button></div></div>
  <div className={styles.status} aria-live="polite"><span>{dirty?'Há alterações não publicadas.':'Conteúdo atualizado.'}</span><small>Revisão {published.revision}{published.publishedAt?' · '+new Date(published.publishedAt).toLocaleString('pt-BR'):''}</small></div>
  {error&&<Alert tone="error" title="Não foi possível publicar">{error}</Alert>}
  {success&&<Alert tone="success">{success}</Alert>}
  <div className={styles.layout}><nav className={styles.side} aria-label="Áreas do editor"><span>Páginas</span>{draft.pages.map(entry=><button type="button" key={entry.id} aria-current={selected===entry.id?'page':undefined} onClick={()=>setSelected(entry.id)}>{entry.label}<small>{entry.path}</small></button>)}<span>Conteúdo compartilhado</span>{[['portfolio','Projetos'],['settings','Marca e contatos'],['contact','Formulário'],['digital','Dispositivos e redes'],['ui','Textos de interface']].map(([id,label])=><button type="button" key={id} aria-current={selected===id?'page':undefined} onClick={()=>setSelected(id)}>{label}</button>)}</nav>
   <div className={styles.body}><fieldset disabled={saving||uploads>0}>
    {page&&<PageFields key={page.id} page={page} site={draft} siteUrl={siteUrl} onChange={value=>change({...draft,pages:draft.pages.map(entry=>entry.id===value.id?value:entry)})}/>}
    {selected==='portfolio'&&<ProjectFields projects={draft.projects} siteUrl={siteUrl} onChange={projects=>change({...draft,projects,pages:draft.pages.map(entry=>({...entry,sections:entry.sections.map(section=>({...section,projectIds:section.projectIds.filter(id=>projects.some(project=>project.id===id)),projectId:projects.some(project=>project.id===section.projectId)?section.projectId:''}))}))})}/>}
    {['settings','contact','ui'].includes(selected)&&<GlobalFields selected={selected} site={draft} siteUrl={siteUrl} onChange={change}/>}
    {selected==='digital'&&<DigitalFields value={draft.digital} siteUrl={siteUrl} onChange={digital=>change({...draft,digital})}/>}
   </fieldset></div>
  </div>
 </div></MediaActivityContext.Provider>;
}
