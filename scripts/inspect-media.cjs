const { chromium } = require('C:/Users/carlo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage();
 await page.goto('http://127.0.0.1:4173/assets/193.png');
 for(const name of ['studio','film']) {
  const result=await page.evaluate(async(name)=>{
   const v=document.createElement('video');v.muted=true;v.src='/assets/'+name+'.mp4';v.preload='auto';
   await new Promise((r,j)=>{v.onloadedmetadata=r;v.onerror=j});
   const frames=[];
   for(const t of [0.5,v.duration*.3,v.duration*.6,v.duration*.85]) {
    v.currentTime=t;await new Promise(r=>v.onseeked=r);
    const c=document.createElement('canvas');c.width=960;c.height=Math.round(960*v.videoHeight/v.videoWidth);c.getContext('2d').drawImage(v,0,0,c.width,c.height);frames.push(c.toDataURL('image/jpeg',.88).split(',')[1]);
   }
   return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,frames};
  },name);
  result.frames.forEach((f,i)=>fs.writeFileSync('qa/'+name+'-'+i+'.jpg',Buffer.from(f,'base64')));
  console.log(name,JSON.stringify({...result,frames:undefined}));
 }
 await browser.close();
})();
