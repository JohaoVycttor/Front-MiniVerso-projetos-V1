import type { Metadata } from "next";
import { LeadDetailView } from "@/features/leads/lead-detail-view";

export const metadata: Metadata = { title: "Detalhe do lead" };

type LeadPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadPage({ params }: LeadPageProps) {
  const { id } = await params;
  return <LeadDetailView id={id} />;
}
