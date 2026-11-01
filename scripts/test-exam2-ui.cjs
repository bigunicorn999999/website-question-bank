const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8')),els=new Map(),saved={};
const element=()=>({value:'',textContent:'',innerHTML:'',hidden:false,style:{},dataset:{},options:[],parentElement:{hidden:false},classList:{toggle(){}},setAttribute(){},add(o){this.options.push(o)},focus(){},select(){},showModal(){},close(){}});
const get=s=>{if(!els.has(s))els.set(s,element());return els.get(s)},nav=['questions','guides','answers','saved'].map(tab=>Object.assign(element(),{dataset:{tab}}));
const context=vm.createContext({console,URL,URLSearchParams,Option:function(text,value){this.text=text;this.value=value},Blob,location:{search:'?review=chem-6-8&set=chem-exam2&family=F09',href:'http://test/'},history:{replaceState(a,b,url){context.location.search=url}},navigator:{},localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v},document:{querySelector:get,querySelectorAll:s=>s==='[data-tab]'?nav:[],body:element()},katex:require(path.join(root,'vendor/katex/katex.min.js')),fetch:async()=>({ok:true,json:async()=>data}),setTimeout,alert:m=>{throw Error(m)}});
vm.runInContext(fs.readFileSync(path.join(root,'library.js'),'utf8'),context);const run=s=>vm.runInContext(s,context);
setImmediate(async()=>{try{
 assert.equal(get('#total').textContent,120);assert.equal(get('#status').value,'chem-exam2');assert.equal(get('#chem-family').value,'F09');assert.equal(get('#result-count').textContent,'3 questions');
 const html=get('#list').innerHTML;assert(html.indexOf('lewis-cocl2.svg')<html.indexOf('class="mcq-options"'));assert(html.includes('class="answer chapter-body" hidden'));assert(!html.includes('Your reasoning / answer'));
 get('#chem-family').value='';for(const [filter,n]of [['chem-exam2',72],['chem-core',24],['chem-professor',24],['chem-multiple',32],['chem-figures',22]]){get('#status').value=filter;run('render()');assert.equal(get('#result-count').textContent,n+' questions')}
 get('#status').value='all';get('#chem-family').value='F20';run('render()');assert.equal(get('#result-count').textContent,'4 questions');assert(get('#list').innerHTML.includes('benzonitrile.svg'));
 get('#topic').value='CHEM 6';run('render()');assert.equal(get('#result-count').textContent,'0 questions');get('#topic').value='';get('#chem-family').value='';
 run("state['C6-07']={choices:[0],saved:true,done:true};");assert(!run("choiceList(data.questions.find(q=>q.id==='C6-07'))").includes(' checked'));
 await get('#import').onchange({target:{files:[{text:async()=>JSON.stringify({'C6-07':{choices:[0],saved:true,done:true},'CE2-01C':{choices:[0,2,99,-1,0],choiceVersion:'exam2-2026-10-31'}})}],value:'test'}});
 assert.equal(run("state['C6-07'].choices.length"),0);assert(run("state['C6-07'].saved&&state['C6-07'].done"));assert.equal(run("state['CE2-01C'].choices.join(',')"),'0,2');
 const card={dataset:{id:'CE2-01C'},querySelector:()=>null,querySelectorAll:s=>s==='[data-choice]:checked'?[{dataset:{choice:'1'}},{dataset:{choice:'3'}}]:[]};get('#list').onchange({target:{matches:s=>s==='[data-choice]',closest:()=>card}});
 assert.equal(run("state['CE2-01C'].choices.join(',')"),'1,3');assert.equal(run("state['CE2-01C'].choiceVersion"),'exam2-2026-10-31');
 get('#status').value='all';get('#search').value='';run("tab='answers';render()");assert.equal(get('#result-count').textContent,'120 questions');assert(get('#list').innerHTML.includes('Why:'));
 run("setReview('chapter15')");assert(get('#periodic-container').hidden);assert.equal(run('tab'),'guides');assert(get('#chem-family').hidden);
 run("setReview('chem-6-8')");assert.equal(get('#chem-family').value,'');assert.equal(get('#result-count').textContent,'120 questions');
 // Grading compares exact sets; answer reveals with no choice do not create progress.
 function mockCard(q){
  const options=q.choices.map(()=>({classes:new Set(),classList:{toggle(){}}}));
  for(const el of options)el.classList={toggle:(k,on)=>on?el.classes.add(k):el.classes.delete(k),remove:(...ks)=>ks.forEach(k=>el.classes.delete(k))};
  const reviewed={},feedback={classList:{toggle(){}}},bookmark={classList:{toggle(){}},setAttribute(){}};
  return {options,reviewed,feedback,bookmark,querySelectorAll:()=>options,querySelector:s=>s==='.done input'?reviewed:s==='.mcq-feedback'?feedback:s==='.bookmark'?bookmark:null};
 }
 for(const [id,mode]of [['CE2-01A','empty'],['CE2-01A','right'],['CE2-01B','wrong'],['CE2-01C','partial'],['CE2-01C','right']]){
  const q=data.questions.find(q=>q.id===id),card=mockCard(q),correct=q.correctChoices;
  const choices=mode==='empty'?[]:mode==='wrong'?[q.choices.findIndex((_,i)=>!correct.includes(i))]:mode==='partial'?correct.slice(0,1):[...correct];
  context.testCard=card;context.testQ=q;context.testChoices=choices;run("state[testQ.id]={choices:testChoices,choiceVersion:testQ.choiceVersion};gradeAttempt(testCard,testQ)");
  const result=run('state[testQ.id]');if(mode==='empty'){assert(!result.done&&!result.saved);continue}
  assert(result.done);assert.equal(!!result.saved,['wrong','partial'].includes(mode));assert(card.reviewed.checked);
  for(const i of correct)assert(card.options[i].classes.has('choice-correct'));
  for(const i of choices.filter(i=>!correct.includes(i)))assert(card.options[i].classes.has('choice-wrong'));
 }
 run("showSourceLabels=false;render()");assert(!get('#list').innerHTML.includes('class=\"source-badge\"'));assert(get('#list').innerHTML.includes('Question 1'));
 for(const q of data.questions.filter(q=>q.choices)){context.testQ=q;assert(run('correctChoicesFor(testQ).length')>0,q.id+' grading key')}
 console.log('PASS: filtering/deep links, selections/import, cross-subject navigation, neutral labels, no-choice reveals, correct/wrong/partial grading, automatic reviewed/saved, and grading keys for every MCQ.');
 }catch(e){console.error(e);process.exitCode=1}});
