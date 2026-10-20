"use client";

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import StudioPage from '@/app/sobre/StudioPage';
import '@/app/sobre/studio-page.css';
import ContactPageView from '@/app/contato/ContactPageView';
import '@/app/contato/contact-page.css';
import SolutionsPage from '@/app/servicos/SolutionsPage';
import '@/app/servicos/solutions.css';

export default function StudioPreview({ content, onClose, pageType = 'studio' }) {
  const Page = pageType === 'contactPage' ? ContactPageView : pageType === 'solutions' ? SolutionsPage : StudioPage;
  const dialog = useRef(null);
  const [device, setDevice] = useState('desktop');
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  function prepareFrame(event) {
    const doc = event.currentTarget.contentDocument;
    if (!doc) return;
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach(style => {
      doc.head.appendChild(style.cloneNode(true));
    });
    const style = doc.createElement('style');
    style.textContent = '.studio-page,.solutions-page,.contact-page{padding-top:0!important}.studio-pending,.solutions-pending{opacity:1!important;transform:none!important}body{margin:0}';
    doc.head.appendChild(style);
    setTarget(doc.body);
  }

  return <dialog ref={dialog} className="studio-preview" aria-labelledby="studio-preview-title" onCancel={onClose}>
    <div className="studio-preview-toolbar">
      <div><strong id="studio-preview-title">Prévia das alterações</strong><small>Confira o rascunho antes de salvar.</small></div>
      <div className="editor-actions">
        <button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}>Desktop</button>
        <button type="button" aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}>Celular</button>
        <button type="button" onClick={onClose}>Fechar prévia</button>
      </div>
    </div>
    <div className="studio-preview-stage">
      <iframe title={pageType==='contactPage'?'Prévia da página Contato':pageType==='solutions'?'Prévia da página Soluções':'Prévia da página O estúdio'} className={device} srcDoc={'<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body></body></html>'} onLoad={prepareFrame}/>
      {target && createPortal(<div onClickCapture={event => { if (event.target.closest('a')) event.preventDefault(); }}><Page content={content} preview/></div>, target)}
    </div>
  </dialog>;
}
