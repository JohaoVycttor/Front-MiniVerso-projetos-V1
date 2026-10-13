"use client";

import mockContent from "@/data/content.json";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="fallback-page"><p className="eyebrow">{mockContent.brand.name}</p><h1>{mockContent.ui.errorTitle}</h1><p>{mockContent.ui.errorDescription}</p><button className="button" onClick={reset}>{mockContent.ui.retry}</button></main>;
}
