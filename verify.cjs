const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const {JSDOM}=require('../PeakCut/build/ui-tests/node_modules/jsdom');
const html=fs.readFileSync('dist/index.html','utf8'),js=fs.readFileSync('dist/app.js','utf8');
for(const configured of [false,true]){
 const dom=new JSDOM(html,{url:'https://momentra.test/',runScripts:'outside-only'}),w=dom.window,d=w.document;
 w.MOMENTRA_CONFIG=configured?{downloadUrl:'https://example.com/Momentra.exe',githubUrl:'https://github.com/example/momentra'}:{};
 w.eval(js);
 d.querySelector('[data-caption=neon]').click();assert.equal(d.querySelector('#output-preview').dataset.caption,'neon');assert.equal(d.querySelector('[data-caption=neon]').getAttribute('aria-pressed'),'true');
 d.querySelector('[data-layout=bottom]').click();assert.equal(d.querySelector('#output-preview').dataset.layout,'bottom');
 d.querySelector('#demo-theme').click();assert(d.querySelector('#product-demo').classList.contains('demo-dark'));
 d.querySelector('#demo-render').click();assert(d.querySelector('#demo-state').textContent.includes('Facecam bottom'));assert(d.querySelector('#product-demo').classList.contains('is-previewing'));
 assert.equal(d.querySelectorAll('button[data-caption][aria-pressed=true]').length,1);
 for(const a of d.querySelectorAll('[data-download]'))assert.equal(a.getAttribute('href'),configured?'https://example.com/Momentra.exe':'#download');
 if(configured)assert.equal(d.querySelector('[data-github]').href,'https://github.com/example/momentra');else{d.querySelector('[data-github]').click();assert(d.querySelector('#site-toast').textContent.includes('coming soon'));}
 for(const a of d.querySelectorAll('a[href^="#"]')){const id=a.getAttribute('href').slice(1);if(id)assert(d.getElementById(id),id);}
 const ids=[...d.querySelectorAll('[id]')].map(x=>x.id);assert.equal(ids.length,new Set(ids).size);
 dom.window.close();
}
console.log('PASS caption selection, layouts, theme, sample playback, link configuration, anchor targets and unique IDs');
