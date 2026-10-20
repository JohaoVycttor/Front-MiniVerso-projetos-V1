import CardMotion from "@/app/components/CardMotion";
import "./globals.css";
import "./studio.css";
import "./design-system.css";
import "./home.css";
import "./cms.css";
import "./brand-fonts.css";
import SiteMotion from "@/app/components/SiteMotion";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import {getContent} from "@/lib/db";
import {siteContent} from "@/lib/site-content";
export const dynamic="force-dynamic";
export const metadata={title:{default:"Miniverso | Realidade que transforma",template:"%s | Miniverso"},description:"Experiências em realidade virtual, aumentada e vídeos 360 para educação, treinamento e marcas.",icons:{icon:"/favicon.svg"}};
export default async function RootLayout({children}){
 const settings=siteContent(await getContent());
 return <html lang="pt-BR" data-scroll-behavior="smooth"><body data-card-hover={String(settings.interactions.cardHover)} data-card-entrance={String(settings.interactions.cardEntrance)}><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><Header settings={settings}/><SiteMotion/><CardMotion/><main id="conteudo">{children}</main><Footer settings={settings}/></body></html>;
}
