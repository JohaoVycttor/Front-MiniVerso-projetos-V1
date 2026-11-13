
export function contentApiConfig(env=process.env){
 const mode=(env.CONTENT_SOURCE||'').trim();
 const remote=mode==='api'||(mode!=='local'&&(env.API_MODE==='live'||Boolean(env.API_URL&&env.API_MODE!=='mock')));
 const apiUrl=(env.API_URL||'').trim().replace(/\/+$/,'');
 if(remote&&!/^https?:\/\//i.test(apiUrl))throw new Error('Configure API_URL para a API de conteúdo.');
 return {remote,apiUrl};
}
export async function publicApi(path,options={}){
 const {apiUrl}=contentApiConfig();
 const response=await fetch(apiUrl+path,{...options,headers:{Accept:'application/json',...(options.body?{'Content-Type':'application/json'}:{}),...options.headers},cache:'no-store',signal:AbortSignal.timeout(10000)});
 const data=await response.json().catch(()=>null);
 if(!response.ok||!data)throw new Error('A API de conteúdo não respondeu corretamente.');
 return data.data??data;
}
export async function readLimitedBody(request,limit=16000){
 const reader=request.body?.getReader();if(!reader)throw new SyntaxError('Corpo vazio.');
 const parts=[];let length=0;
 while(true){const part=await reader.read();if(part.done)break;length+=part.value.byteLength;if(length>limit){await reader.cancel();throw new RangeError('Conteúdo muito grande.');}parts.push(part.value);}
 return Buffer.concat(parts).toString('utf8');
}
