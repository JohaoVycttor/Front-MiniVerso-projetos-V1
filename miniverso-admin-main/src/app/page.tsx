import { redirect } from "next/navigation";
import { ADMIN_HOME } from "@/lib/routes";

// Este projeto é só o painel. A raiz leva direto para ele.
export default function Home() {
  redirect(ADMIN_HOME);
}
