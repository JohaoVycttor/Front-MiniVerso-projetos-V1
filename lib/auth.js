import crypto from "crypto";

const secret=()=>process.env.SESSION_SECRET||"development-only-change-me";
export function credentialsValid(user,password){return user===(process.env.ADMIN_USER||"admin@miniverso.com.br")&&password===(process.env.ADMIN_PASSWORD||"miniverso123")}
export function createToken(){const payload=Buffer.from(JSON.stringify({exp:Date.now()+1000*60*60*8})).toString("base64url");const sig=crypto.createHmac("sha256",secret()).update(payload).digest("base64url");return `${payload}.${sig}`}
export function tokenValid(token=""){try{const [payload,sig]=token.split(".");const expected=crypto.createHmac("sha256",secret()).update(payload).digest("base64url");if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;return JSON.parse(Buffer.from(payload,"base64url")).exp>Date.now()}catch{return false}}
