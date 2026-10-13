import Image from "next/image";

export default function Logo({ light = false }) {
  return (
    <span className={`brand ${light ? "brand-light" : ""}`}>
      <Image src="/logo-symbol.png" width={54} height={34} alt="" priority />
      <span>miniverso</span>
    </span>
  );
}
