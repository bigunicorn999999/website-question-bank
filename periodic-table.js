// Static reference cells: searching only highlights and reveals matching entries.
const periodicSearch=document.querySelector('#element-search');
periodicSearch.addEventListener('input',()=>{
 const query=periodicSearch.value.trim().toLowerCase(),cells=[...document.querySelectorAll('.periodic-cell')];
 const exact=cells.filter(c=>c.dataset.symbol===query);
 const matches=query?cells.filter(c=>/^\d+$/.test(query)?Number(c.dataset.number)===Number(query):exact.length?c.dataset.symbol===query:c.dataset.name.includes(query)):[];
 const found=new Set(matches);for(const c of cells)c.classList.toggle('element-match',found.has(c));
 document.querySelector('#element-result').textContent=!query?'118 elements':matches.length?matches.slice(0,5).map(c=>`${c.querySelector('.element-name').textContent} (${c.querySelector('.element-symbol').textContent}, ${c.dataset.number})`).join(' · ')+(matches.length>5?` · ${matches.length} matches`:''):'No matching element';
 if(matches.length===1)matches[0].scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
});

const periodicReference=document.querySelector('#periodic-reference');
document.querySelectorAll('#periodic-container details').forEach(panel=>panel.addEventListener('toggle',()=>document.body.classList.toggle('periodic-open',!!document.querySelector('#periodic-container details[open]')&&!document.querySelector('#periodic-container').hidden)));
