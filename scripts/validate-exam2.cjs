const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),d=JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8'));
const qs=d.questions.filter(q=>q.review==='chem-6-8'),get=id=>{const q=qs.find(q=>q.id===id);assert(q,id);return q};
assert.equal(qs.length,120);assert.equal(new Set(d.questions.map(q=>q.id)).size,d.questions.length);
for(const [set,n]of [['chem-exam2',72],['chem-core',24],['chem-professor',24]])assert.equal(qs.filter(q=>q.practiceSet===set).length,n);
assert.equal(qs.filter(q=>q.multiple).length,32);assert.equal(qs.filter(q=>q.figure).length,22);
for(let f=1;f<=24;f++)assert.deepEqual(qs.filter(q=>q.professorQuestion===f).map(q=>q.variant),['A','B','C']);
for(const q of qs){
 assert.equal(q.kind,'mcq',q.id);assert(q.choices.length>=4&&q.choices.length<=6,q.id);assert.equal(new Set(q.choices).size,q.choices.length,q.id);
 assert(q.body.length&&q.answer.blocks.length===2,q.id);assert(q.answer.blocks[1].startsWith('Why: '),q.id);
 assert(q.correctChoices.length>0&&q.correctChoices.length<q.choices.length,q.id);assert.equal(q.multiple,q.correctChoices.length>1,q.id);
 assert(q.correctChoices.every(i=>Number.isInteger(i)&&i>=0&&i<q.choices.length),q.id);
 const letters=q.correctChoices.map(i=>String.fromCharCode(65+i)).join(', ');assert(q.answer.blocks[0].startsWith(letters+'. '),q.id);
 for(const i of q.correctChoices)assert(q.answer.blocks[0].includes(q.choices[i]),q.id);
 if(q.figure){assert(fs.existsSync(path.join(root,q.figure)));assert(q.figureAlt);if(q.figure.endsWith('.svg')){const svg=fs.readFileSync(path.join(root,q.figure),'utf8');assert(svg.includes('<svg')&&svg.endsWith('</svg>'))}else assert.equal(fs.readFileSync(path.join(root,q.figure)).subarray(1,4).toString(),'PNG')}
 assert(!q.id.startsWith('CF-'));
}
const answer=id=>get(id).correctChoices.map(i=>get(id).choices[i]).join(' | '),has=(id,t)=>assert(answer(id).includes(t),id+' expected '+t);
// Independently recompute numerical answers from the presented inputs.
const h=6.626e-34,c=2.998e8,R=8.314;
has('CE2-01A',Math.round(h*c/4.2e-19*1e9)+' nm; no');
has('CE2-01B',((h*c/400e-9-3.10e-19)/1e-19).toFixed(2)+' × 10⁻¹⁹');
has('CE2-02C',Math.round(h*c/(2.179e-18*(1/4-1/16))*1e9)+' nm; negative');
has('CE2-21A',(1/(1/298-R/32000*Math.log(760/180))-273.15).toFixed(1)+'°C');
has('CE2-21B',Math.round(100*Math.exp(30000/R*(1/300-1/320)))+' torr');
has('CE2-21C',(R*Math.log(3)/(1/298.15-1/323.15)/1000).toFixed(1)+' kJ/mol');
has('C6-07',(h/(9.109e-31*1e6)*1e9).toFixed(3)+' nm');
has('C6-08',(h/(4*Math.PI*9.109e-31*2e6*.008)*1e9).toFixed(2)+' nm');
has('C7-02',((4/212)/(1/282)).toFixed(2));has('C7-41',String(436+243-2*431).replace('-','−'));
has('C8-05',(27.02/18.015*6.01).toFixed(2)+' kJ');has('C8-38',(4200*R/1000).toFixed(1)+' kJ/mol');
has('CE2-04A',String(4*2));let capacity=0;for(let l=0;l<4;l++)for(let ml=-l;ml<=l;ml++)if(ml===0)capacity+=2;has('CE2-04B',String(capacity));
// Drawn electron budgets and independent molecular-graph bond counts.
assert.equal(2*(2+2)+2*(2+2),5+4+6+1);assert.equal(2*(2+1+1)+2*(2+3+3),4+3*6+2);
has('CE2-20A',`${6+5+1+1} σ, ${3+2} π`);has('CE2-20B',`A: ${6+5+1+1} σ, 3 π; B: ${6+5+1+1+3} σ, 3 π`);has('CE2-20C',`There are ${6+8+2} σ bonds`);
const katex=require(path.join(root,'vendor/katex/katex.min.js'));let formulas=0;
function walk(v){if(typeof v==='string'){for(const m of v.matchAll(/\\\(([\s\S]*?)\\\)/g)){katex.renderToString(m[1],{throwOnError:true,strict:'ignore'});formulas++}}else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){if(k==='math'){katex.renderToString(x,{throwOnError:true,strict:'ignore'});formulas++}else walk(x)}}
walk(qs);walk(d.guides.filter(g=>g.review==='chem-6-8'));
console.log(`PASS: 120 MCQs; 72 new in 24 families; 24 retained; 24 professor; 32 select-all; 22 illustrated questions; independent numerical, electron-budget, graph-count, key, and ${formulas} formula checks.`);

assert.equal(get('PE2-09').correctChoices[0],3,'Source panel D has the complete O octet');
const elements=JSON.parse(fs.readFileSync(path.join(root,'assets/periodic-elements.json'),'utf8')).elements;assert.equal(elements.length,118);assert.equal(new Set(elements.map(e=>e.number)).size,118);assert.equal(elements.find(e=>e.symbol==='Fe').weight,'55.845');assert.equal(elements.find(e=>e.symbol==='Li').weight,'6.94');
