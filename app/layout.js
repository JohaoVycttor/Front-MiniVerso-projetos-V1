import "./globals.css";
import "./studio.css";
import "./design-system.css";
import SiteMotion from "@/app/components/SiteMotion";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: { default: "Miniverso | Realidade que transforma", template: "%s | Miniverso" },
  description: "Experiências em realidade virtual, aumentada e vídeos 360 para educação, treinamento e marcas.",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <Header />
        <SiteMotion />
        <main id="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
