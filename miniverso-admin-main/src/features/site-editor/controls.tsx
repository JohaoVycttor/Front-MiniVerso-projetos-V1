
"use client";
import Image from 'next/image';
import {createContext,useContext,useId,useRef,useState} from 'react';
import {TextField,TextAreaField} from '@/components/ui/field';
import {Button} from '@/components/ui/button';
import {isSafeSiteUrl} from './schema';
import styles from './site-editor.module.css';
export const MediaActivityContext=createContext<(delta:number)=>void>(()=>{});
export function Field({label,value,onChange,large=false,hint,required=false}:{label:string;value:string;onChange:(value:string)=>void;large?:boolean;hint?:string;required?:boolean}){
 return large?<TextAreaField label={label} value={value||''} onChange={event=>onChange(event.target.value)} rows={3} hint={hint} required={required}/>:<TextField label={label} value={value||''} onChange={event=>onChange(event.target.value)} hint={hint} required={required}/>;
}
export type MediaValue={src:string;alt:string;caption?:string;poster?:string};
export function MediaControls({value,onChange,siteUrl,video=false,caption=true}:{value:MediaValue;onChange:(value:MediaValue)=>void;siteUrl:string;video?:boolean;caption?:boolean}){
 const activity=useContext(MediaActivityContext),id=useId(),file=useRef<HTMLInputElement>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const resolved=(url:string)=>url.startsWith('/')&&!url.startsWith('/api/media/')?siteUrl.replace(/\/$/,'')+url:url;
 const preview=value.src&&isSafeSiteUrl(value.src)&&/^(?:https?:\/\/|\/(?!\/))/i.test(value.src);
 async function upload(event:React.ChangeEvent<HTMLInputElement>){
  const selected=event.target.files?.[0];event.target.value='';if(!selected)return;setError('');
  const limit=video?50:2;
  if(selected.size>limit*1024*1024){setError('O arquivo deve ter no máximo '+limit+' MB.');return;}
  if(!(video?/\.(mp4|webm)$/i:/\.(jpe?g|png|webp)$/i).test(selected.name)){setError('Formato de arquivo inválido.');return;}
  setBusy(true);activity(1);
  try{
   const data=new FormData();data.append('file',selected);
   const response=await fetch('/api/uploads',{method:'POST',body:data,credentials:'same-origin'});
   const result=await response.json();if(!response.ok)throw new Error(result.message||'Não foi possível enviar o arquivo.');
   if(typeof result.url!=='string'||!isSafeSiteUrl(result.url))throw new Error('A API não retornou uma URL de mídia válida.');
   onChange({...value,src:result.url});
  }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível enviar.');}
  finally{setBusy(false);activity(-1);}
 }
 return <div className={styles.media}><div className={styles.mediaHeader}><strong>{video?'Vídeo':'Imagem'}</strong><div><Button size="sm" variant="secondary" onClick={()=>file.current?.click()} disabled={busy} loading={busy}>{value.src?'Substituir arquivo':'Enviar arquivo'}</Button>{value.src&&<Button size="sm" variant="ghost" onClick={()=>onChange({...value,src:''})}>Remover</Button>}</div></div>
 <input ref={file} id={id} className="sr-only" type="file" accept={video?'video/mp4,video/webm':'image/jpeg,image/png,image/webp'} onChange={upload} disabled={busy}/>
 {preview&&<div className={styles.mediaPreview}>{video?<video src={resolved(value.src)} poster={value.poster?resolved(value.poster):undefined} controls preload="metadata"/>:<Image src={resolved(value.src)} alt={value.alt||'Prévia da imagem'} width={960} height={540} unoptimized/>}</div>}
 <Field label={video?'Endereço do vídeo':'Endereço da imagem'} value={value.src} onChange={src=>onChange({...value,src})} hint={video?'MP4 ou WebM, até 50 MB.':'JPG, PNG ou WebP, até 2 MB. Ou use uma URL HTTP/HTTPS ou um caminho público.'}/>
 <div className={styles.two}><Field label="Descrição da imagem ou vídeo" value={value.alt} onChange={alt=>onChange({...value,alt})} hint="Texto alternativo para leitores de tela."/>{caption&&<Field label="Legenda" value={value.caption||''} onChange={caption=>onChange({...value,caption})}/>}</div>
 {video&&<Field label="Imagem de capa do vídeo (URL)" value={value.poster||''} onChange={poster=>onChange({...value,poster})}/>}<span role="status" className={styles.error}>{error}</span>
 </div>;
}
