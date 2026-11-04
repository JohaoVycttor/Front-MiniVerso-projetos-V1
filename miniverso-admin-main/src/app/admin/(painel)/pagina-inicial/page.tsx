import type { Metadata } from "next";
import { HomeEditor } from "@/features/home-editor/home-editor";
import { publicConfig } from "@/lib/public-config";

export const metadata: Metadata = { title: "Página inicial" };

export default function PaginaInicialPage() {
  return <HomeEditor siteUrl={publicConfig.siteUrl} />;
}
