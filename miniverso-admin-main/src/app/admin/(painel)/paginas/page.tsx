import type { Metadata } from "next";
import { PagesEditor } from "@/features/pages-editor/pages-editor";
import { publicConfig } from "@/lib/public-config";

export const metadata: Metadata = { title: "Páginas do site" };

export default function PaginasPage() {
  return <PagesEditor siteUrl={publicConfig.siteUrl} />;
}
