const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8'));
const els=new Map(),saved={};
const element=()=>({value:'',textContent:'',innerHTML:'',hidden:false,style:{},dataset:{},options:[],parentElement:{hidden:false},classList:{toggle(){}},setAttribute(){},add(o){this.options.push(o)},focus(){},select(){},showModal(){},close(){}});
const get=s=>{if(!els.has(s))els.set(s,element());return els.get(s)};
const nav=['questions','guides','answers','saved'].map(tab=>Object.assign(element(),{dataset:{tab}}));
const context=vm.createContext({console,URL,URLSearchParams,Option:function(text,value){this.text=text;this.value=value},Blob,location:{search:'?review=chem-6-8&set=chem-learn',href:'http://test/'},history:{replaceState(a,b,url){context.location.search=url}},navigator:{},localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v},document:{querySelector:get,querySelectorAll:s=>s==='[data-tab]'?nav:[],body:element()},katex:require(path.join(root,'vendor/katex/katex.min.js')),fetch:async()=>({ok:true,json:async()=>data}),setTimeout,alert:m=>{throw Error(m)}});
vm.runInContext(fs.readFileSync(path.join(root,'library.js'),'utf8'),context);
const run=s=>vm.runInContext(s,context);
setImmediate(async()=>{try{
 assert.equal(get('#status').value,'chem-learn');assert.equal(get('#result-count').textContent,'26 questions');assert.equal(get('#total').textContent,142);
 assert(get('#list').innerHTML.includes('Hint · think through the connection'));assert(get('#list').innerHTML.includes('Your reasoning / answer'));assert(get('#list').innerHTML.includes('class="answer chapter-body" hidden'));
 for(const [filter,count]of [['chem-class',52],['chem-integrated',52],['chem-foundations',12]]){get('#status').value=filter;run('render()');assert.equal(get('#result-count').textContent,count+' questions')}
 get('#status').value='chem-class';get('#topic').value='CHEM 7';run('render()');assert.equal(get('#result-count').textContent,'18 questions');
 get('#topic').value='';get('#status').value='all';get('#search').value='C6-38';run('render()');assert.equal(get('#result-count').textContent,'1 question');assert(get('#list').innerHTML.includes('6.63 cm.'));
 // A real app event handler stores typed reasoning; import preserves it.
 const target={value:'Energy increases as wavelength decreases.',matches:s=>s==='[data-draft]',closest:()=>({dataset:{id:'C6-21'}})};
 get('#list').oninput({target});assert.equal(JSON.parse(saved['practice-library-progress-v1'])['C6-21'].draft,target.value);
 const uploaded={target:{files:[{text:async()=>JSON.stringify({'C6-21':{draft:'Imported reasoning',done:true},'C6-32':{choices:[0,3,99,-1,0]}})}],value:'test'}};
 await get('#import').onchange(uploaded);assert.equal(run("state['C6-21'].draft"),'Imported reasoning');assert.equal(run("state['C6-32'].choices.join(',')"),'0,3');
 run("setReview('chapter15')");assert(get('#chemistry-intro').hidden);assert.equal(run('tab'),'guides');
 run("setReview('chem-6-8');tab='answers';render()");assert.equal(get('#result-count').textContent,'142 questions');assert(get('#list').innerHTML.includes('Why:'));
 console.log('PASS: study filters, combined topic filtering, deep-link loading, hidden answers, draft persistence/import, choice sanitization, answer-key coverage, and other-subject navigation.');
 }catch(e){console.error(e);process.exitCode=1}});
