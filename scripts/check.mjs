import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'../dist');
const html=await readFile(resolve(root,'index.html'),'utf8');
for(const file of ['app.js','content.js']){const result=spawnSync(process.execPath,['--check',resolve(root,file)],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);}
for(const match of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)){assert((await stat(resolve(root,match[1]))).isFile(),`Missing asset: ${match[1]}`);}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);assert.equal(new Set(ids).size,ids.length,'Duplicate IDs');
for(const match of html.matchAll(/href="#([^"]+)"/g)){assert(ids.includes(match[1]),`Invalid anchor: ${match[1]}`);}
assert.equal((html.match(/<h1\b/g)||[]).length,1,'Exactly one H1 required');
const hero=html.match(/<video id="hero-video"[^>]+>/)[0];for(const attribute of ['autoplay','muted','loop','playsinline'])assert(hero.includes(attribute));assert(!hero.includes('controls'));
const {projects}=await import('../dist/content.js');for(const project of projects)for(const field of ['src','poster'])await stat(resolve(root,project[field]));
console.log('Build/check OK: static site ready in dist; JavaScript, media, navigation and hero attributes verified.');
