import type { Metadata } from "next";
import "./globals.css";
import mockContent from "@/data/content.json";

export const metadata: Metadata = { title: { default: mockContent.brand.name, template: `%s — ${mockContent.brand.name}` }, description: mockContent.metadata.description };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
