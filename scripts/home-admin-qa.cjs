const assert=require("node:assert/strict");
const path=require("node:path");
const os=require("node:os");
const {pathToFileURL}=require("node:url");
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(os.tmpdir(),"miniverso-home-qa/node_modules/playwright"));
const root=process.env.QA_URL||"http://localhost:3000";
(async()=>{
 const browser=await chromium.launch({channel:"msedge",headless:true});
 let context,original,contactId;
 const tag="CMS-QA-"+Date.now();
 async function put(type,content){const r=await context.request.put(root+"/api/admin/content",{data:{type,content}});assert.equal(r.status(),200,await r.text())}
 try{
  const anonymous=await browser.newContext();
  assert.equal((await anonymous.request.put(root+"/api/admin/content",{data:{type:"home",content:{}}})).status(),401);
  await anonymous.close();
  context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:"reduce"});
  const errors=[];const page=await context.newPage();page.on("pageerror",e=>errors.push(e.message));
  await page.goto(root+"/admin",{waitUntil:"networkidle"});
  await page.locator("input[name=user]").fill(process.env.ADMIN_USER||"admin@miniverso.com.br");
  await page.locator("input[name=password]").fill(process.env.ADMIN_PASSWORD||"miniverso123");
  await page.getByRole("button",{name:"Entrar",exact:true}).click();
  await page.getByRole("button",{name:"Salvar página inicial",exact:true}).waitFor();
  original=await (await context.request.get(root+"/api/admin/content")).json();
  // Exercise the visual editor rather than only its API.
  const first=page.locator(".cms-editor-section").first();
  await first.locator("summary").first().click();
  await first.getByLabel("Título",{exact:true}).fill(tag);
  await page.getByRole("button",{name:"Salvar página inicial",exact:true}).click();
  await page.getByRole("status").filter({hasText:"Alterações salvas"}).waitFor();
  const publicPage=await context.newPage();publicPage.on("pageerror",e=>errors.push(e.message));
  await publicPage.goto(root,{waitUntil:"networkidle"});
  assert.ok((await publicPage.locator("h1").textContent()).includes(tag));
  await page.getByRole("button",{name:"Visualizar alterações",exact:true}).click();
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button",{name:"Ver no celular",exact:true}).click();
  assert.equal(await page.locator(".cms-preview-frame.mobile").count(),1);
  assert.equal(await page.locator(".cms-preview button[type=submit]:enabled").count(),0);
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(),0);
  console.log("PASS visual editor, save and isolated preview");
  const home=structuredClone(original.home),site=structuredClone(original.site);
  home.sections.find(s=>s.type==="hero").title=tag;
  const form=home.sections.find(s=>s.type==="contact");
  form.form.title="Formulário "+tag;form.subjects=["Projeto "+tag];
  form.extraFields=[{id:"orcamento",label:"Faixa de orçamento",type:"select",required:true,placeholder:"Selecione a faixa",options:["Até 10 mil","Acima de 10 mil"]}];
  const text={...structuredClone(home.sections.find(s=>s.type==="cta")||home.sections.find(s=>s.type==="hero"))};
  // Explicit templates ensure a different component can be added through the API.
  const base={enabled:true,label:"Seção de teste",title:"Texto "+tag,highlight:"dinâmico",description:"Conteúdo cadastrado pelo administrador.",layout:"stacked",background:"#071122",accent:"#aabbff",image:"",imagePosition:"center",overlay:0.3,padding:50,columns:2};
  home.sections.splice(2,0,{...base,id:"qa-text",type:"text",button:"Contato",href:"/contato"});
  home.sections.push({...base,id:"qa-hidden",type:"cards",enabled:false,layout:"cards",title:"OCULTA-"+tag,items:[{title:"Card",description:"Texto",image:"",button:"Abrir",href:"/contato"}]});
  site.header.links[0].label="Início "+tag;site.header.button="Botão "+tag;site.footer.note="Rodapé "+tag;
  await Promise.all([put("home",home),put("site",site)]);
  await publicPage.goto(root,{waitUntil:"networkidle"});
  await publicPage.locator("h1").filter({hasText:tag}).waitFor();
  assert.equal(await publicPage.getByRole("link",{name:"Início "+tag,exact:true}).count(),1);
  assert.ok((await publicPage.locator(".footer-bottom").textContent()).includes("Rodapé "+tag));
  assert.equal(await publicPage.locator("#qa-text").count(),1);
  assert.equal(await publicPage.locator("#qa-hidden").count(),0);
  assert.equal(await publicPage.locator(".home-contact form header h2").textContent(),"Formulário "+tag);
  assert.equal(await publicPage.locator(".home-contact select[name=subject] option").count(),2);
  for(const width of [1440,768,390,320]){
   await publicPage.setViewportSize({width,height:900});await publicPage.waitForTimeout(100);
   const sizes=await publicPage.evaluate(()=>({width:innerWidth,content:document.documentElement.scrollWidth}));
   assert.ok(sizes.content<=sizes.width,JSON.stringify(sizes));
  }
  await publicPage.setViewportSize({width:1440,height:1000});
  const accordion=publicPage.locator(".home-service h3 button");await accordion.nth(1).click();assert.equal(await accordion.nth(1).getAttribute("aria-expanded"),"true");
  console.log("PASS dynamic hero, navigation, footer, section ordering/visibility and responsive layout");
  const fields=publicPage.locator(".home-contact form");
  await fields.locator("[name=name]").fill(tag);
  await fields.locator("[name=email]").fill("qa@example.com");
  await fields.locator("[name=subject]").selectOption("Projeto "+tag);
  await fields.locator("[name=message]").fill("Mensagem temporária para validar o fluxo "+tag);
  await fields.locator("[name=consent]").check();
  await fields.locator("button[type=submit]").click();
  assert.equal(await fields.locator('[name="extra.orcamento"]').getAttribute("aria-invalid"),"true");
  await fields.locator('[name="extra.orcamento"]').selectOption("Acima de 10 mil");
  const sent=publicPage.waitForResponse(r=>r.url().endsWith("/api/contact")&&r.request().method()==="POST");
  await fields.locator("button[type=submit]").click();
  assert.equal((await sent).status(),201);
  await fields.locator(".contact-feedback.success").waitFor();
  let latest=await (await context.request.get(root+"/api/admin/content")).json();
  const received=latest.contacts.find(c=>c.name===tag);assert.ok(received);contactId=received.id;
  assert.equal(received.source,"home");assert.ok(received.protocol.startsWith("MV-"));
  assert.equal(received.customFields[0].value,"Acima de 10 mil");
  await page.reload({waitUntil:"networkidle"});
  await page.getByRole("button",{name:"Mensagens recebidas",exact:true}).click();
  await page.locator(".contact-inbox").getByRole("heading",{name:tag,exact:true}).waitFor();
  assert.ok((await page.locator(".contact-inbox").textContent()).includes("Faixa de orçamento: Acima de 10 mil"));
  console.log("PASS real submission, required custom field, protocol, persistence and admin inbox");
  // A failing request must preserve the draft so the visitor can retry.
  await fields.locator("[name=name]").fill(tag+"-retry");await fields.locator("[name=email]").fill("qa@example.com");
  await fields.locator("[name=subject]").selectOption("Projeto "+tag);
  await fields.locator("[name=message]").fill("Manter esta mensagem");
  await fields.locator('[name="extra.orcamento"]').selectOption("Até 10 mil");
  await fields.locator("[name=consent]").check();
  await publicPage.route("**/api/contact",route=>route.fulfill({status:500,json:{error:"Teste"}}));
  await fields.locator("button[type=submit]").click();await fields.locator(".contact-feedback.error").waitFor();
  assert.equal(await fields.locator("[name=message]").inputValue(),"Manter esta mensagem");
  await publicPage.unroute("**/api/contact");
  const invalid=structuredClone(home);invalid.sections[0].href="javascript:alert(1)";
  assert.equal((await context.request.put(root+"/api/admin/content",{data:{type:"home",content:invalid}})).status(),400);
  const payload={name:"QA",email:"qa@example.com",message:"Teste",consent:true,preference:"email",subject:form.subjects[0],source:"home",sectionId:form.id,extra:{}};
  assert.equal((await context.request.post(root+"/api/contact",{data:payload})).status(),400);
  assert.equal((await context.request.post(root+"/api/contact",{data:{...payload,sectionId:"missing",extra:{orcamento:"Até 10 mil"}}})).status(),400);
  console.log("PASS retry preservation and server validation");
  // Render custom source and alternate components/layouts.
  const variant=structuredClone(home);
  const services=variant.sections.find(s=>s.type==="services");services.source="custom";services.layout="cards";services.items=[{title:"Serviço "+tag,description:"Serviço personalizado",icon:"screen",tags:["Teste"]}];
  const projects=variant.sections.find(s=>s.type==="projects");projects.source="custom";projects.layout="list";projects.items=[{title:"Projeto "+tag,description:"Projeto personalizado",category:"QA",image:"/hero-vr.jpg",href:"/contato"}];
  const processSection=variant.sections.find(s=>s.type==="process");processSection.layout="list";
  variant.sections.find(s=>s.id==="qa-hidden").enabled=true;
  variant.sections.push({...base,id:"qa-cta",type:"cta",layout:"centered",button:"CTA "+tag,href:"/contato"});
  await put("home",variant);await publicPage.reload({waitUntil:"networkidle"});
  assert.equal(await publicPage.locator(".home-services-cards .home-service").count(),1);
  assert.ok((await publicPage.locator(".home-project h3").textContent()).includes("Projeto "+tag));
  assert.equal(await publicPage.locator("#qa-hidden").count(),1);
  assert.equal(await publicPage.getByRole("link",{name:"CTA "+tag,exact:true}).count(),1);
  projects.source="portfolio";await put("home",variant);await publicPage.reload({waitUntil:"networkidle"});
  const integrated=original.portfolio.projects.filter(p=>p.visible).sort((a,b)=>a.order-b.order);
  assert.equal(await publicPage.locator(".home-project").count(),Math.min(projects.limit,integrated.length));
  assert.equal(await publicPage.locator(".home-project h3").first().textContent(),integrated[0].title);
  assert.deepEqual(errors,[]);
  console.log("PASS custom sources, component variants and no browser errors");
 }finally{
  if(original&&context){await put("home",original.home);await put("site",original.site)}
  if(contactId){const {updateContent}=await import(pathToFileURL(path.join(process.cwd(),"lib/db.js")).href);await updateContent(data=>{data.contacts=data.contacts.filter(c=>c.id!==contactId)})}
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exit(1)});
