"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaAsset, PageContent } from "@/types/content";
import { ImageIcon, PlayIcon } from "@/components/ui";

export function MediaPlaceholder({ label, video = false }: { label: string; video?: boolean }) {
  return <div className={`media-placeholder ${video ? "video-placeholder" : ""}`} aria-hidden="true">{video ? <span className="play-circle"><PlayIcon/></span> : <ImageIcon/>}<span className="micro-label">{label}</span></div>;
}

export function MediaPreview({ asset, ui, presentation = false }: { asset: MediaAsset; ui: PageContent["ui"]; presentation?: boolean }) {
  const [open, setOpen] = useState(false);
  const src = asset.type === "video" ? asset.poster : asset.src;
  const placeholder = <MediaPlaceholder label={presentation ? ui.videoPlaceholder : ui.coverPlaceholder} video={presentation}/>;
  if (!presentation) return src ? <img className="media-image" src={src} alt={asset.alt} loading="lazy"/> : placeholder;
  return <>
    <button className="media-trigger" onClick={() => setOpen(true)} aria-label={`${ui.play}: ${asset.alt}`}>
      {src ? <><img className="media-image" src={src} alt={asset.alt}/><span className="play-overlay"><span className="play-circle"><PlayIcon/></span></span></> : placeholder}
    </button>
    {open && <MediaDialog asset={asset} ui={ui} onClose={() => setOpen(false)}/>}
  </>;
}

function MediaDialog({ asset, ui, onClose }: { asset: MediaAsset; ui: PageContent["ui"]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const focused = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = old; focused?.focus(); };
  }, []);
  return <dialog ref={ref} className="media-dialog glass" onCancel={onClose} aria-label={asset.alt} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-content"><button className="dialog-close" onClick={onClose} aria-label={ui.close}>×</button>
      {asset.src ? (asset.type === "video" ? <video key={asset.id} src={asset.src} poster={asset.poster} controls autoPlay playsInline><track kind="captions"/></video> : <img src={asset.src} alt={asset.alt}/>) : <div className="unavailable-media"><span className="play-circle"><PlayIcon/></span><h2>{ui.unavailableTitle}</h2><p>{ui.unavailableDescription}</p><button className="button" onClick={onClose}>{ui.close}</button></div>}
      {asset.caption && <p className="media-caption">{asset.caption}</p>}
    </div>
  </dialog>;
}

export function Gallery({ assets, ui }: { assets: MediaAsset[]; ui: PageContent["ui"] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const asset = assets[active];
  if (!asset) return null;
  return <section className="project-gallery" aria-label={ui.galleryLabel}>
    <div className="gallery-heading"><p className="eyebrow">[ {ui.galleryLabel} ]</p><span className="micro-label">{String(active + 1).padStart(2, "0")} / {String(assets.length).padStart(2, "0")}</span></div>
    <button className="gallery-stage glass" onClick={() => setOpen(true)} aria-label={asset.alt}>
      {asset.type === "image" && asset.src ? <img src={asset.src} alt={asset.alt} loading="lazy"/> : asset.poster ? <img src={asset.poster} alt={asset.alt} loading="lazy"/> : <MediaPlaceholder label={asset.alt} video={asset.type === "video"}/>}
      {asset.type === "video" && asset.poster && <span className="play-overlay"><span className="play-circle"><PlayIcon/></span></span>}
    </button>
    <div className="gallery-controls"><p>{asset.caption || asset.alt}</p>{assets.length > 1 && <div><button onClick={() => setActive((active + assets.length - 1) % assets.length)} aria-label={ui.previous}>←</button><button onClick={() => setActive((active + 1) % assets.length)} aria-label={ui.next}>→</button></div>}</div>
    {open && <MediaDialog asset={asset} ui={ui} onClose={() => setOpen(false)}/>}
  </section>;
}
