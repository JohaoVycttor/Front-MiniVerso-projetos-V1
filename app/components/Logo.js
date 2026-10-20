import Image from "next/image";
export default function Logo({light=false,brand={name:"miniverso",logo:"/logo-symbol.png"}}){
 return <span className={`brand ${light?"brand-light":""}`}>{brand.logo&&<Image src={brand.logo} width={54} height={34} alt="" unoptimized/>}<span>{brand.name}</span></span>;
}
