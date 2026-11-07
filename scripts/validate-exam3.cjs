const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),d=JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8')),katex=require(path.join(root,'vendor/katex/katex.min.js'));
const qs=d.questions.filter(q=>q.review==='chapter15'),fresh=qs.filter(q=>q.practiceSet==='exam3-new');
assert.equal(qs.length,186);assert.equal(fresh.length,114);assert.equal(new Set(d.questions.map(q=>q.id)).size,d.questions.length);
assert.equal(fresh.filter(q=>q.choices).length,49);assert.equal(qs.filter(q=>q.figure).length,16);
let formulas=0;
function scan(v,id){if(typeof v==='string'){for(const m of v.matchAll(/\\\(([\s\S]*?)\\\)/g)){katex.renderToString(m[1],{throwOnError:true,strict:'ignore'});formulas++}}else if(Array.isArray(v))v.forEach(x=>scan(x,id));else if(v&&typeof v==='object')for(const [key,x]of Object.entries(v)){if(key==='math')katex.renderToString(x,{throwOnError:true,strict:'ignore'});else scan(x,id)}}
for(const q of qs){
 assert(['15.1','15.2','15.3','15.6','15.7','15.8','15.9'].includes(q.section));assert(q.source&&q.answer.blocks.length&&q.body.length);
 if(q.practiceSet==='exam3-source')assert(q.sourceQuestion);
 if(q.choices){assert.equal(q.choices.length,5,q.id);assert.equal(new Set(q.choices).size,5,q.id);assert.equal(q.correctChoices.length,1);const i=q.correctChoices[0];assert(i>=0&&i<5);assert(q.answer.blocks[0].startsWith(String.fromCharCode(65+i)+'.'),q.id)}
 if(q.figure){assert(fs.existsSync(path.join(root,q.figure)));assert(q.figureAlt);assert(fs.readFileSync(path.join(root,q.figure),'utf8').includes('<svg'))}
 assert(!/\b(draw|sketch|shade)\b/i.test(q.body.join(' ')),q.id);scan(q,q.id);
}
for(const section of ['15.1','15.2','15.3','15.6','15.7','15.8','15.9'])assert(fresh.filter(q=>q.section===section).length>=14);
console.log(`PASS: ${fresh.length} new + ${qs.length-fresh.length} source questions; 5-choice single-answer MCQs; all keys, source/section tags, ${formulas} formulas, 16 figure assets, and no drawing prompts.`);
