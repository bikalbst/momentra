const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const {JSDOM}=require('../PeakCut/build/ui-tests/node_modules/jsdom');
const html=fs.readFileSync('dist/index.html','utf8');
const d=new JSDOM(html).window.document;
const ids=[...d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);
for(const a of d.querySelectorAll('a[href^="#"]'))if(a.hash.length>1)assert(d.getElementById(a.hash.slice(1)),a.hash);
for(const el of d.querySelectorAll('[src],[poster]'))for(const attr of ['src','poster']){const value=el.getAttribute(attr);if(value&&!/^(https?:|data:)/.test(value))assert(fs.existsSync(path.join('dist',value)),value);}
assert.equal(d.querySelectorAll('.sample-card').length,3);assert.equal(d.querySelectorAll('[data-studio-tab]').length,3);
assert(fs.existsSync('dist/assets/downloads/Momentra-Source-Setup-v16.zip'));
assert(html.includes('cozy.js'));assert(html.includes('cozy.css'));
console.log('PASS: structure, unique IDs, anchors, local media, previews and source download.');
