import crypto from "crypto";

const production=()=>process.env.NODE_ENV==="production";
const secret=()=>process.env.SESSION_SECRET||(!production()?"development-only-change-me":null);
export function credentialsValid(user,password){const expectedUser=process.env.ADMIN_USER||(!production()?"admin@miniverso.com.br":null);const expectedPassword=process.env.ADMIN_PASSWORD||(!production()?"miniverso123":null);return Boolean(secret()&&expectedUser&&expectedPassword&&user===expectedUser&&password===expectedPassword)}
export function createToken(){const key=secret();if(!key)throw new Error("SESSION_SECRET não configurado");const payload=Buffer.from(JSON.stringify({exp:Date.now()+1000*60*60*8})).toString("base64url");const sig=crypto.createHmac("sha256",key).update(payload).digest("base64url");return `${payload}.${sig}`}
export function tokenValid(token=""){try{const key=secret();if(!key)return false;const [payload,sig,...extra]=token.split(".");if(!payload||!sig||extra.length)return false;const expected=crypto.createHmac("sha256",key).update(payload).digest("base64url");if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;return JSON.parse(Buffer.from(payload,"base64url")).exp>Date.now()}catch{return false}}
