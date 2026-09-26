import type { Config, Context } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import { getUser } from "@netlify/identity";
import { fal } from "@fal-ai/client";

const LEVEL:any={trial:0,start:1,pro:2,agency:3};
const MODELS:any={
  "omni-flash":{provider:"fal",model:"google/gemini-omni-flash/v1.1/text-to-video",perSecond:7,max:10,minPlan:"trial"},
  "seedance":{provider:"higgsfield",model:"bytedance/seedance-2.0/text-to-video",perSecond:10,max:10,minPlan:"pro"}
};

function out(data:any,status=200){return Response.json(data,{status})}
async function account(user:any){
  const db=getDatabase(); const p=await db.pool.connect();
  try{
    let q=await p.query("SELECT * FROM user_accounts WHERE user_id=$1",[user.id]);
    if(q.rows[0]) return q.rows[0];
    const name=user.userMetadata?.full_name||user.email?.split("@")[0]||"Criador";
    q=await p.query("INSERT INTO user_accounts(user_id,email,display_name,plan,credits_balance,monthly_credits) VALUES($1,$2,$3,'trial',100,100) RETURNING *",[user.id,user.email||"",name]);
    await p.query("INSERT INTO credit_ledger(id,user_id,amount,balance_after,reason) VALUES($1,$2,100,100,$3)",[crypto.randomUUID(),user.id,"Créditos iniciais de teste"]);
    return q.rows[0];
  } finally {p.release()}
}
async function submit(modelKey:string,input:any){
  const s=MODELS[modelKey];
  if(s.provider==="fal"){
    const key=Netlify.env.get("FAL_KEY"); if(!key) throw Object.assign(new Error("Omni Flash ainda não foi conectado à conta SYRAX."),{status:503});
    fal.config({credentials:key});
    const r:any=await fal.queue.submit(s.model,{input:{prompt:input.prompt,aspect_ratio:input.aspect,resolution:"360p",duration:input.duration}});
    return r.request_id||r.requestId;
  }
  const id=Netlify.env.get("HF_API_KEY_ID"),secret=Netlify.env.get("HF_API_KEY_SECRET");
  if(!id||!secret) throw Object.assign(new Error("A API Higgsfield ainda não foi conectada à conta SYRAX."),{status:503});
  const r=await fetch("https://api.higgsfield.ai/"+s.model,{method:"POST",headers:{Authorization:"Key "+id+":"+secret,"Content-Type":"application/json"},body:JSON.stringify({prompt:input.prompt,duration:input.duration,aspect_ratio:input.aspect,resolution:"720p",generate_audio:true})});
  const b:any=await r.json(); if(!r.ok) throw Object.assign(new Error(b?.detail||b?.message||"Falha no provedor."),{status:r.status});
  return b.request_id||b.id;
}
export default async(req:Request,_ctx:Context)=>{
  try{
    const user:any=await getUser(); if(!user)return out({error:"Faça login para continuar."},401);
    const a=await account(user); const path=new URL(req.url).pathname; const db=getDatabase();
    if(path==="/api/me")return out({account:a});
    if(path==="/api/projects"&&req.method==="GET"){
      const p=await db.pool.connect();try{const q=await p.query("SELECT * FROM projects WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 100",[user.id]);return out({projects:q.rows})}finally{p.release()}
    }
    if(path==="/api/projects"&&req.method==="POST"){
      const b:any=await req.json();const name=String(b.name||"").trim().slice(0,120);if(!name)return out({error:"Informe o nome do projeto."},400);
      const p=await db.pool.connect();try{const id=crypto.randomUUID();const q=await p.query("INSERT INTO projects(id,user_id,name,kind,brief_json) VALUES($1,$2,$3,$4,$5::jsonb) RETURNING *",[id,user.id,name,b.kind==="quick"?"quick":"campaign",JSON.stringify(b.brief||{})]);return out({project:q.rows[0]},201)}finally{p.release()}
    }
    if(path==="/api/generate"&&req.method==="POST"){
      const b:any=await req.json(),key=String(b.model||"omni-flash"),s=MODELS[key];if(!s)return out({error:"Modelo inválido."},400);
      if((LEVEL[a.plan]||0)<(LEVEL[s.minPlan]||0))return out({error:"Esse modelo exige um plano superior."},403);
      const prompt=String(b.prompt||"").trim().slice(0,6000);if(prompt.length<10)return out({error:"Descreva melhor o anúncio."},400);
      const duration=Math.max(3,Math.min(s.max,Number(b.duration)||5)),aspect=b.aspect==="16:9"?"16:9":"9:16",cost=Math.ceil(duration*s.perSecond);
      if(Number(a.credits_balance)<cost)return out({error:"Saldo insuficiente. Esta geração custa "+cost+" créditos."},402);
      const requestId=await submit(key,{prompt,duration,aspect});
      const p=await db.pool.connect();try{
        await p.query("BEGIN");const lock=await p.query("SELECT credits_balance FROM user_accounts WHERE user_id=$1 FOR UPDATE",[user.id]);const bal=Number(lock.rows[0]?.credits_balance||0);if(bal<cost)throw Object.assign(new Error("Saldo insuficiente."),{status:402});
        const after=bal-cost,job=crypto.randomUUID();await p.query("UPDATE user_accounts SET credits_balance=$1,updated_at=NOW() WHERE user_id=$2",[after,user.id]);
        await p.query("INSERT INTO generation_jobs(id,user_id,provider,model,prompt,status,duration_seconds,aspect_ratio,credits_cost,provider_request_id) VALUES($1,$2,$3,$4,$5,'queued',$6,$7,$8,$9)",[job,user.id,s.provider,s.model,prompt,duration,aspect,cost,requestId]);
        await p.query("INSERT INTO credit_ledger(id,user_id,amount,balance_after,reason,job_id) VALUES($1,$2,$3,$4,$5,$6)",[crypto.randomUUID(),user.id,-cost,after,"Geração "+key,job]);await p.query("COMMIT");
        return out({jobId:job,cost,message:"Geração enviada. O acompanhamento automático entra na próxima etapa."},202);
      }catch(e){await p.query("ROLLBACK");throw e}finally{p.release()}
    }
    if(path==="/api/credits"){
      const p=await db.pool.connect();try{const q=await p.query("SELECT * FROM credit_ledger WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50",[user.id]);return out({items:q.rows})}finally{p.release()}
    }
    return out({error:"Rota não encontrada."},404);
  }catch(e:any){console.error(e);return out({error:e?.message||"Erro no servidor."},Number(e?.status)||500)}
};
export const config:Config={path:["/api/me","/api/projects","/api/generate","/api/credits"]};
