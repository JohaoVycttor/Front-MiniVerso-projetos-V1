"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaAsset, PageContent } from "@/types/content";
import { ImageIcon, PlayIcon, VrIcon } from "@/components/ui";
import { formatDuration } from "@/lib/format";

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

export function PresentationPlayer({ asset, ui }: { asset: MediaAsset; ui: PageContent["ui"] }) {
  const [open, setOpen] = useState(false);
  return <figure className="detail-presentation">
    <div className="presentation-stage">
      {asset.poster ? <img src={asset.poster} alt=""/> : <VrIcon/>}
      <button className="watch-button" onClick={() => setOpen(true)}><PlayIcon/>{ui.watchPresentation}{asset.duration !== undefined && ` · ${formatDuration(asset.duration)}`}</button>
    </div>
    {asset.caption && <figcaption className="detail-caption">{asset.caption}</figcaption>}
    {open && <MediaDialog asset={asset} ui={ui} onClose={() => setOpen(false)}/>}
  </figure>;
}

export function Gallery({ assets, ui }: { assets: MediaAsset[]; ui: PageContent["ui"] }) {
  const [open, setOpen] = useState<MediaAsset | null>(null);
  if (!assets.length) return null;
  return <section className="project-gallery" aria-label={ui.galleryLabel}>
    <p className="eyebrow">[ {ui.galleryLabel} ]</p>
    <div className="gallery-grid">{assets.map((asset, index) => {
      const src = asset.type === "image" ? asset.src : asset.poster;
      return <figure key={asset.id}>
        <button className="gallery-thumb" onClick={() => setOpen(asset)} aria-label={asset.alt}>
          {src ? <img src={src} alt={asset.alt} loading="lazy"/> : asset.type === "image" && <ImageIcon/>}
          {asset.type === "video" && <span className="play-overlay"><span className="play-circle"><PlayIcon/></span></span>}
        </button>
        <figcaption className="gallery-caption"><span>{String(index + 1).padStart(2, "0")}</span>{asset.caption || asset.alt}</figcaption>
      </figure>;
    })}</div>
    {open && <MediaDialog asset={open} ui={ui} onClose={() => setOpen(null)}/>}
  </section>;
}
