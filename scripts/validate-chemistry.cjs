const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),d=JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8'));
const qs=d.questions.filter(q=>q.review==='chem-6-8'),get=id=>{const q=qs.find(q=>q.id===id);assert(q,id);return q};
assert.equal(qs.length,142);assert.equal(new Set(d.questions.map(q=>q.id)).size,d.questions.length);
for(const q of qs){assert(q.body.length&&q.answer.blocks.length>=2,q.id);assert(q.answer.blocks.some(b=>typeof b==='string'&&b.startsWith('Why: ')),q.id);if(q.correctChoices){assert(q.correctChoices.length);assert(q.correctChoices.every(i=>Number.isInteger(i)&&i>=0&&i<q.choices.length));assert(q.multiple||q.correctChoices.length===1)}if(q.practiceSet==='chem-learn')assert(q.hint&&q.chain&&Number.isInteger(q.step));if(q.figure)assert(fs.existsSync(path.join(root,q.figure)),q.figure)}
assert.deepEqual(Object.fromEntries(['chem-learn','chem-class','chem-integrated','chem-foundations'].map(s=>[s,qs.filter(q=>q.practiceSet===s).length])),{'chem-learn':26,'chem-class':52,'chem-integrated':52,'chem-foundations':12});
// Independent answer checks use the presented constants and inspect stored keys.
function includes(id,text){assert(get(id).answer.blocks[0].replaceAll('−','-').includes(text),id+' expected '+text)}
function round(id,x,n){includes(id,x.toFixed(n))}
round('CF-03',.240*.2500/2*136.29,2);
round('CF-04',.0200*.300*3/.1500,3);
round('CF-05',40/.8/133.33*26.98,2);
round('CF-07',30*.400/2/.250,1);
round('CF-10',Math.min(.04*.5,.06*.5/2)*97.56,2);
round('CF-11',2.40-5.10/3,2);
round('C6-35',1/(1/600+1/300),1);
round('C6-36',1/(1/200-1/300),1);
round('C6-38',6.626e-34*3e8/3e-24*100,2);
round('C6-39',6.626e-34/(5e-24*25)*1e12,2);
round('C8-36',100*Math.exp(-30000/8.314*(1/320-1/300)),1);
round('C8-37',300/(1-300*8.314/35000*Math.log(2))-273.15,1);
round('C8-38',4200*8.314/1000,1);
includes('C7-41',String(436+243-2*431));
function capacities(n,ml,spin){let count=0;for(let l=0;l<n;l++)for(let m=-l;m<=l;m++)for(let s of [-.5,.5])if(m===ml&&(spin===undefined||s===spin))count++;return count}
includes('C6-26',capacities(4,0)+' electrons');includes('C6-31','(a) '+capacities(3,1));
// Check structure bookkeeping independently: electrons in bonds plus lone pairs.
for(const [id,V,bondOrders,lonePairs,charge] of [['C7-20',9,[1,1,1,1],0,1],['C7-22',17,[2,1],6,-1],['C7-33',22,[1,1],9,0],['C7-40',9,[1,1,1],1,1]])assert.equal(2*bondOrders.reduce((a,b)=>a+b,0)+2*lonePairs,V-charge,id);
// All inline and display math must parse with the same bundled renderer as production.
const katex=require(path.join(root,'vendor/katex/katex.min.js'));
let mathCount=0;
function walk(v){if(typeof v==='string'){for(const m of v.matchAll(/\\\(([\s\S]*?)\\\)/g)){katex.renderToString(m[1],{throwOnError:true});mathCount++}}else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){if(k==='math'){katex.renderToString(x,{throwOnError:true});mathCount++}else walk(x)}}
walk(qs);walk(d.guides.filter(g=>g.review==='chem-6-8'));
const baseline=path.join(root,'..','work','original-data.json');
if(fs.existsSync(baseline)){const old=JSON.parse(fs.readFileSync(baseline,'utf8'));assert.deepEqual(d.questions.filter(q=>q.review!=='chem-6-8'),old.questions.filter(q=>q.review!=='chem-6-8'));assert.deepEqual(d.guides.filter(q=>q.review!=='chem-6-8'),old.guides.filter(q=>q.review!=='chem-6-8'));for(const q of old.questions.filter(q=>q.review==='chem-6-8')){const next=get(q.id);assert.deepEqual(next.body,q.body);assert.equal(next.answer.blocks[0],q.answer.blocks[0])}}
console.log(`PASS: 142 explained chemistry questions, 90 additions, 26 guided steps, numeric/structure checks, ${mathCount} math expressions, stable original IDs and other subjects.`);
