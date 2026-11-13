
import assert from 'node:assert/strict';
import {after,before,describe,it} from 'node:test';
import {promises as fs} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createServer,type Server} from 'node:http';
import {GET,PUT} from '@/app/api/admin/pages/route';
import {POST as upload} from '@/app/api/uploads/route';
import {POST as login} from '@/app/api/auth/login/route';
import {normalizeSiteDocument} from '../../../../shared/site-content.mjs';
import {publicApi} from '../../../../shared/content-client.mjs';
import {validateSiteDocument,type SiteDocument} from '@/features/site-editor/schema';
let directory:string,cookie:string,seed:SiteDocument,server:Server;
const origin='http://localhost:3001';
function request(method='GET',body?:unknown,headers:Record<string,string>={}){
 return new Request(origin+'/api/admin/pages',{method,headers:{cookie,origin,'content-type':'application/json',...headers},body:body===undefined?undefined:JSON.stringify(body)});
}
before(async()=>{
 process.env.API_MODE='mock';process.env.CONTENT_SOURCE='local';process.env.MOCK_LATENCY_MS='0';
 directory=await fs.mkdtemp(path.join(os.tmpdir(),'miniverso-content-unit-'));
 process.env.HOME_DATA_DIR=directory;
 seed=validateSiteDocument(normalizeSiteDocument(JSON.parse(await fs.readFile(path.join(process.cwd(),'..','data','site-content.json'),'utf8'))));
 await fs.writeFile(path.join(directory,'site-content.json'),JSON.stringify(seed));
 const response=await login(new Request(origin+'/api/auth/login',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({login:'admin@miniverso.test',password:'miniverso123'})}));
 assert.equal(response.status,200);cookie=response.headers.get('set-cookie')!.split(';')[0];
});
after(async()=>{if(server)await new Promise<void>(resolve=>server.close(()=>resolve()));assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir())+path.sep+'miniverso-content-unit-'));await fs.rm(directory,{recursive:true,force:true});});
describe('publicação do documento completo',()=>{
 it('recusa acesso sem sessão e gravações de outra origem',async()=>{
  assert.equal((await GET(request('GET',undefined,{cookie:''}))).status,401);
  assert.equal((await PUT(request('PUT',seed,{origin:'https://outro-site.test'}))).status,403);
 });
 it('publica os textos, imagens e legendas das cinco páginas e preserva os novos campos',async()=>{
  const next=structuredClone(seed);
  for(const page of next.pages){page.hero.title='Novo título / '+page.id;page.hero.caption='Nova legenda';page.hero.image='https://cdn.example.com/'+page.id+'.webp';page.hero.imageAlt='Nova imagem';}
  next.digital.social.bio='Biografia atualizada';
  const response=await PUT(request('PUT',next));assert.equal(response.status,200);
  const saved=(await response.json()).data as SiteDocument;
  assert.equal(saved.revision,seed.revision+1);
  assert.equal(saved.digital.social.bio,'Biografia atualizada');
  assert.equal((await fs.readFile(path.join(directory,'site-content.json'),'utf8')).includes('Novo título / contact'),true);
  assert.deepEqual((await (await GET(request())).json()).data,saved);
 });
 it('recusa publicação antiga sem sobrescrever a nova revisão',async()=>{
  assert.equal((await PUT(request('PUT',seed))).status,409);
  assert.equal((await (await GET(request())).json()).data.revision,seed.revision+1);
 });
 it('recusa scripts em imagens, IDs duplicados e referências quebradas',()=>{
  const bad=structuredClone(seed);bad.pages[0].hero.image='javascript:alert(1)';
  assert.throws(()=>validateSiteDocument(bad),/Endereço/);
  const duplicate=structuredClone(seed);duplicate.pages[0].sections.push(duplicate.pages[0].sections[0]);
  assert.throws(()=>validateSiteDocument(duplicate),/repetidos/);
  const broken=structuredClone(seed);broken.pages[0].sections[0].projectIds=['inexistente'];
  assert.throws(()=>validateSiteDocument(broken),/não existe/);
 });
 it('rejeita documento incompleto sem alterar o arquivo salvo',async()=>{
  const before=await fs.readFile(path.join(directory,'site-content.json'),'utf8');
  const invalid=structuredClone(seed);invalid.pages.pop();
  assert.equal((await PUT(request('PUT',invalid))).status,422);
  assert.equal(await fs.readFile(path.join(directory,'site-content.json'),'utf8'),before);
 });
 it('permite hero e cards sem imagem e permite preencher a mídia depois',()=>{
  const value=structuredClone(seed);value.pages[1].hero.image='';value.pages[1].hero.slides=[];
  validateSiteDocument(value);
  const section=value.pages[0].sections.find(entry=>entry.type==='formats')!;
  section.items[0].image='https://cdn.example.com/formato.jpg';section.items[0].imageAlt='Formato cadastrado';section.items[0].caption='Legenda cadastrada';
  validateSiteDocument(value);
 });
 it('publica upload local real e rejeita extensão disfarçada',async()=>{
  const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aS9sAAAAASUVORK5CYII=','base64');
  const form=new FormData();form.set('file',new File([bytes],'teste.png',{type:'image/png'}));
  const response=await upload(new Request(origin+'/api/uploads',{method:'POST',headers:{cookie,origin},body:form}));
  assert.equal(response.status,201);const {url}=await response.json();
  assert.match(url,/^\/api\/media\/[a-f0-9-]+\.png$/);
  assert.deepEqual(await fs.readFile(path.join(directory,'uploads',url.split('/').pop())),bytes);
  const invalid=new FormData();invalid.set('file',new File(['não é uma imagem'],'falsa.png',{type:'image/png'}));
  assert.equal((await upload(new Request(origin+'/api/uploads',{method:'POST',headers:{cookie,origin},body:invalid}))).status,422);
 });
});
describe('contrato da futura API PHP',()=>{
 before(async()=>{
  let document=structuredClone(seed);
  server=createServer((req,res)=>{
   const reply=(status:number,data:unknown)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(data));};
   if(req.url==='/site-content/public')return reply(200,{data:document});
   if(req.url==='/unavailable')return reply(503,{message:'detalhe interno'});
   if(req.url==='/site-content'&&req.method==='GET'){
    assert.ok(req.headers.authorization?.startsWith('Bearer '));return reply(200,{data:document});
   }
   if(req.url==='/site-content'&&req.method==='PUT'){
    let raw='';req.on('data',chunk=>{raw+=chunk;});req.on('end',()=>{const next=JSON.parse(raw);if(next.revision!==document.revision)return reply(409,{message:'Conflito de revisão'});document={...next,revision:document.revision+1};reply(200,{data:document});});return;
   }
   return reply(404,{message:'Não encontrado'});
  });
  await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const address=server.address() as {port:number};
  process.env.API_URL='http://127.0.0.1:'+address.port;process.env.CONTENT_SOURCE='api';
 });
 it('lê e publica pela API em vez de escrever no JSON local',async()=>{
  const before=await fs.readFile(path.join(directory,'site-content.json'),'utf8');
  const remote=(await (await GET(request())).json()).data as SiteDocument;
  remote.settings.footerTitle='Título vindo da API PHP';
  const response=await PUT(request('PUT',remote));assert.equal(response.status,200);
  assert.equal((await publicApi('/site-content/public')).settings.footerTitle,'Título vindo da API PHP');
  assert.equal(await fs.readFile(path.join(directory,'site-content.json'),'utf8'),before);
 });
 it('propaga o conflito informado pelo PHP',async()=>{
  assert.equal((await PUT(request('PUT',seed))).status,409);
 });
 it('não retorna dados de demonstração quando o back-end falha',async()=>{
  await assert.rejects(()=>publicApi('/unavailable'),/API/);
  process.env.API_URL='http://127.0.0.1:1';
  const response=await GET(request());assert.equal(response.status,503);
  assert.equal((await response.json()).data,undefined);
 });
});
