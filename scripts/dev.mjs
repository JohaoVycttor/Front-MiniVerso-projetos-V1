import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const apps=[{name:'Site',cwd:root,port:'3000'},{name:'Admin',cwd:path.join(root,'miniverso-admin-main'),port:'3001'}];
for(const app of apps){if(!existsSync(path.join(app.cwd,'node_modules/next/dist/bin/next'))){console.error(`Instale as dependências de ${app.name} com npm ci em ${app.cwd}.`);process.exit(1)}}
const children=apps.map(app=>{console.log(`${app.name}: http://localhost:${app.port}${app.name==='Admin'?'/admin/login':''}`);return spawn(process.execPath,[path.join(app.cwd,'node_modules/next/dist/bin/next'),'dev','--hostname','0.0.0.0','--port',app.port],{cwd:app.cwd,stdio:'inherit',windowsHide:true,env:process.env})});
let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;children.forEach(child=>child.kill());process.exitCode=code}
children.forEach(child=>{child.on('error',error=>{console.error(error.message);stop(1)});child.on('exit',code=>stop(code||0))});
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());