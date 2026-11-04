import { getHomeContent } from "@/lib/home-content";
import HomePage from "./components/HomePage";
export const dynamic = "force-dynamic";
export default async function Home() { return <HomePage content={await getHomeContent()}/>; }
