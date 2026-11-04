import { ChevronDown } from "lucide-react";
import "./mobile-content.css";

export default function MobileDisclosure({ children, summary = "Continuar lendo" }) {
  return <><div className="mobile-disclosure-desktop">{children}</div><details className="mobile-disclosure"><summary>{summary}<ChevronDown size={15} aria-hidden="true"/></summary><div className="mobile-disclosure-content">{children}</div></details></>;
}
