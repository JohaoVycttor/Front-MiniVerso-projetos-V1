import { NextResponse } from "next/server";
import { credentialsValid,createToken } from "@/lib/auth";
export async function POST(request){const {user,password}=await request.json();if(!credentialsValid(user,password))return NextResponse.json({error:"Credenciais inválidas"},{status:401});const res=NextResponse.json({ok:true});res.cookies.set("miniverso_session",createToken(),{httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production",path:"/",maxAge:28800});return res}
