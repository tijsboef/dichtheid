document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const dichtheidTabelData = [
        { stof: "Hout", dichtheid: "0.40" }, { stof: "Benzine", dichtheid: "0.72" },
        { stof: "Appel", dichtheid: "0.83" }, { stof: "IJs", dichtheid: "0.92" },
        { stof: "Mens", dichtheid: "0.95" }, { stof: "Water", dichtheid: "1.00" },
        { stof: "Glas", dichtheid: "2.70" }, { stof: "Diamant", dichtheid: "3.51" },
        { stof: "Titanium", dichtheid: "4.50" }, { stof: "Staal", dichtheid: "7.80" },
        { stof: "Koper", dichtheid: "8.96" }, { stof: "Lood", dichtheid: "11.34" },
        { stof: "Goud", dichtheid: "19.32" }, { stof: "Alcohol", dichtheid: "0.80" },
        { stof: "Aluminium", dichtheid: "2.70" }, { stof: "IJzer", dichtheid: "7.87" },
        { stof: "Kurk", dichtheid: "0.25" }, { stof: "Kwik", dichtheid: "13.5" },
    ];

    const theorieVragen = [
        { type: 'mc', vraag: "Wat is de definitie van dichtheid?", opties: ["Hoe zwaar een stof is", "De massa per volume-eenheid", "Hoeveel ruimte een stof inneemt"], antwoord: "De massa per volume-eenheid" },
        { type: 'formula', vraag: "Vul de formule voor dichtheid correct in:", antwoord: "dichtheid=massa/volume" },
        { type: 'mc', vraag: "In welke eenheid wordt dichtheid vaak uitgedrukt in de natuurkunde?", opties: ["kg/L", "g/cm³", "mg/mL"], antwoord: "g/cm³" },
        { type: 'sort', vraag: "Zet het stappenplan voor een berekening in de juiste volgorde:", stappen: ["Gegevens noteren", "Formule noteren", "Formule invullen", "Antwoord en eenheid noteren"], antwoord: "gegevens noteren,formule noteren,formule invullen,antwoord en eenheid noteren" }
    ];
    
    // --- AANGEPASTE DATA VOOR SECTIE 2 ---
    const metingen = {
        set1: [
            { id: '1A', kleur: 'Paars', massa: '19.3', volume: '5.5', dichtheid: '3.51' },
            { id: '1B', kleur: 'Blauw', massa: '0.4', volume: '1', dichtheid: '0.40' },
            { id: '1C', kleur: 'Geel', massa: '19.32', volume: '1', dichtheid: '19.32' },
            { id: '1D', kleur: 'Rood', massa: '5', volume: '5', dichtheid: '1.00' },
            { id: '1E', kleur: 'Groen', massa: '2.8', volume: '7', dichtheid: '0.40' }
        ],
        set2: [
            { id: '2A', kleur: 'Lichtbruin', massa: '18', volume: '1.59', dichtheid: '11.32' },
            { id: '2B', kleur: 'Donkerbruin', massa: '10.8', volume: '4', dichtheid: '2.70' },
            { id: '2C', kleur: 'Groen', massa: '2.7', volume: '1', dichtheid: '2.70' },
            { id: '2D', kleur: 'Roze', massa: '18', volume: '4', dichtheid: '4.50' },
            { id: '2E', kleur: 'Lila', massa: '44.8', volume: '5', dichtheid: '8.96' }
        ],
        set3: [
            { id: '3A', kleur: 'Bordeaux', massa: '2.85', volume: '3', dichtheid: '0.95' },
            { id: '3B', kleur: 'Grijs', massa: '6', volume: '6', dichtheid: '1.00' },
            { id: '3C', kleur: 'Beige', massa: '23.4', volume: '3', dichtheid: '7.80' },
            { id: '3D', kleur: 'Camel', massa: '2', volume: '5', dichtheid: '0.40' },
            { id: '3E', kleur: 'Wit', massa: '6', volume: '6.32', dichtheid: '0.95' }
        ]
    };
    
    // --- AANGEPASTE DATA VOOR SECTIE 3 ---
    const controleVragenData = [
        { vraag: "Een blokje heeft een massa van 270 g en een volume van 100 cm³. Bereken de dichtheid.", teVinden: "dichtheid", data: { m: "270", v: "100" }, antwoord: "2.7" },
        { vraag: "Een gouden ring heeft een volume van 2 cm³. Bereken de massa. Gebruik de dichtheidstabel om de dichtheid van goud op te zoeken.", teVinden: "massa", data: { p: "19.32", v: "2" }, antwoord: "38.64" },
        { vraag: "Een blokje metaal heeft een massa van 780 g en een volume van 100 cm³. Bereken de dichtheid en benoem het materiaal.", teVinden: "dichtheid", data: { m: "780", v: "100" }, antwoord: "7.8", stof: "Staal" },
        { vraag: "Bereken het volume van 1 kg staal. Gebruik de tabel voor de dichtheid en let op de eenheden!", teVinden: "volume", data: { p: "7.8", m: "1000" }, antwoord: "128.21" }
    ];

    const grootheden = ['ρ', 'm', 'V'], eenheden = ['g', 'kg', 'cm³', 'dm³', 'L', 'm³', 'g/cm³', 'kg/L'], operatoren = ['/', '*', '+', '-'];
    const secties = document.querySelectorAll('.content-sectie'), volgendeBtn = document.getElementById('volgende-sectie-btn'), checkBtns = document.querySelectorAll('.check-answers');
    let huidigeSectieIndex = 0;
    const modal = document.getElementById('dichtheid-modal');
    document.getElementById('toggle-table-btn').onclick = () => modal.style.display = "block";
    document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
    volgendeBtn.addEventListener('click', () => { if (huidigeSectieIndex < secties.length - 1) { secties[huidigeSectieIndex].style.display = 'none'; huidigeSectieIndex++; secties[huidigeSectieIndex].style.display = 'block'; if (huidigeSectieIndex === secties.length - 1) { volgendeBtn.style.display = 'none'; } } });
    
    function createDropdown(options) { let html = `<select><option value="">kies...</option>`; options.forEach(opt => html += `<option value="${opt}">${opt}</option>`); return html + `</select>`; }

    function buildStappenplanHTML(id, titel, vraagTekst, data) {
        return `
        <div class="exercise" id="${id}" data-massa="${data.massa||''}" data-volume="${data.volume||''}" data-dichtheid="${data.dichtheid||''}" data-stof="${data.stof||''}" data-antwoord="${data.antwoord||data.dichtheid}">
            <h3>${titel}</h3> <p>${vraagTekst}</p>
            <div class="stappenplan-container">
                <div class="stap-rij"><label>Stap 1:</label>${createDropdown(grootheden)}<span class="equals">=</span><input type="text" placeholder="waarde">${createDropdown(eenheden)}</div>
                <div class="stap-rij"><label></label>${createDropdown(grootheden)}<span class="equals">=</span><input type="text" placeholder="waarde">${createDropdown(eenheden)}</div>
                <div class="stap-rij"><label>Stap 2:</label>${createDropdown(grootheden)}<span class="equals">=</span>${createDropdown(grootheden)}${createDropdown(operatoren)}${createDropdown(grootheden)}</div>
                <div class="stap-rij"><label>Stap 3:</label>${createDropdown(grootheden)}<span class="equals">=</span><input type="text" placeholder="waarde">${createDropdown(operatoren)}<input type="text" placeholder="waarde"></div>
                <div class="stap-rij"><label>Stap 4:</label>${createDropdown(grootheden)}<span class="equals">=</span><input type="text" placeholder="antwoord">${createDropdown(eenheden)}</div>
                ${data.stof ? `<hr><div class="stap-rij"><label>De stof is:</label><input type="text" placeholder="Naam materiaal"></div>` : ''}
            </div> <div class="feedback"></div>
        </div>`;
    }

    function laadSimulatieVragen(setNum) {
        const container = document.getElementById('simulatie-vragen'); container.innerHTML = '';
        metingen[`set${setNum}`].forEach((q, i) => {
            const stof = dichtheidTabelData.find(s => s.dichtheid == q.dichtheid)?.stof || 'Onbekend';
            container.innerHTML += buildStappenplanHTML(`sim-${setNum}-${i}`, `Vraag ${i + 1}: Het ${q.kleur}e Blok`, `Bepaal de massa en het volume van het <strong>${q.kleur}e blok</strong> (ID: ${q.id}) en bereken de dichtheid.`, { massa: q.massa, volume: q.volume, dichtheid: q.dichtheid, stof: stof });
        });
    }

    function laadControleVragen() {
        const container = document.getElementById('controle-vragen'); container.innerHTML = '';
        [...controleVragenData].sort(() => 0.5 - Math.random()).slice(0, 3).forEach((q, i) => {
            container.innerHTML += buildStappenplanHTML(`controle-${i}`, `Vraag ${i + 1}`, q.vraag, { massa: q.data.m, volume: q.data.v, dichtheid: q.data.p, antwoord: q.antwoord, stof: q.stof });
        });
    }

    checkBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectie = e.target.dataset.section;
            const exercises = document.querySelectorAll(`#${sectie}-sectie .exercise`);
            
            if (sectie === 'simulatie' || sectie === 'controle') {
                exercises.forEach(ex => {
                    const feedback = ex.querySelector('.feedback'), correctAnswer = ex.dataset.antwoord, correctStof = ex.dataset.stof;
                    const inputs = ex.querySelectorAll('input, select');
                    const userAnswer = inputs[12]?.value.trim().replace(',', '.');
                    const userStof = inputs[14]?.value.trim().toLowerCase();
                    
                    let isCorrect = userAnswer === correctAnswer;
                    let errorMsg = '';

                    if (correctStof && userStof !== correctStof.toLowerCase()) {
                        isCorrect = false;
                        errorMsg = `De naam van de stof is niet correct. Het juiste antwoord is ${correctStof}. `;
                    }
                    if (userAnswer !== correctAnswer) {
                        isCorrect = false;
                        errorMsg += `Het berekende antwoord klopt niet. Het moest ${correctAnswer} zijn.`;
                    }
                    
                    feedback.style.display = 'block';
                    if (isCorrect) {
                        feedback.textContent = `Helemaal correct! Het antwoord is ${correctAnswer}${correctStof ? ` en de stof is ${correctStof}` : ''}.`;
                        feedback.className = 'feedback correct';
                    } else {
                        feedback.textContent = `Helaas! ${errorMsg}`;
                        feedback.className = 'feedback incorrect';
                    }
                });
            } else { // Oude logica voor sectie 1
                exercises.forEach((ex) => {
                    const feedback = ex.querySelector('.feedback'); const correctAnswer = ex.dataset.answer.toLowerCase().trim(); let userAnswer = '';
                    if (ex.querySelector('.formula-container')) { const selects = ex.querySelectorAll('select'); userAnswer = `${selects[0].value}=${selects[1].value}/${selects[2].value}`;
                    } else if (ex.querySelector('.drop-container')) { const items = ex.querySelectorAll('.target-list .draggable'); userAnswer = Array.from(items).map(item => item.textContent.toLowerCase()).join(',');
                    } else { const input = ex.querySelector('input, select'); if (input) userAnswer = input.value.toLowerCase().trim().replace(',', '.'); }
                    feedback.style.display = 'block';
                    if (userAnswer === correctAnswer) { feedback.textContent = `Correct! Het antwoord is "${ex.dataset.answer}".`; feedback.className = 'feedback correct';
                    } else { feedback.textContent = `Helaas, het juiste antwoord is "${ex.dataset.answer}".`; feedback.className = 'feedback incorrect'; }
                });
            }
        });
    });

    // --- ONGEWIJZIGDE FUNCTIES ---
    function vulDichtheidTabel() { const t=document.getElementById('dichtheid-tabel'); t.innerHTML='<tr><th>Materiaal</th><th>Dichtheid (kg/L of g/cm³)</th></tr>'; dichtheidTabelData.sort((a,b)=>a.stof.localeCompare(b.stof)).forEach(i=>{t.innerHTML+=`<tr><td>${i.stof}</td><td>${i.dichtheid}</td></tr>`;});}
    function laadTheorieVragen() { const c=document.getElementById('theorie-vragen');c.innerHTML='';theorieVragen.forEach((q,i)=>{let h=`<div class="exercise" id="theorie-ex-${i}" data-answer="${q.antwoord}"><label>${i+1}. ${q.vraag}</label>`;if(q.type==='mc'){h+=`<select><option value="">Kies...</option>`;q.opties.forEach(o=>h+=`<option value="${o}">${o}</option>`);h+=`</select>`;}else if(q.type==='formula'){const p=["dichtheid","massa","volume"],cr=()=>{let s=`<select><option value="">kies...</option>`;p.forEach(p=>s+=`<option value="${p}">${p}</option>`);return s+`</select>`;};h+=`<div class="formula-container">${cr()} = ${cr()} / ${cr()}</div>`;}else if(q.type==='sort'){let s=[...q.stappen];while(s.join(',')===q.stappen.join(',')){s.sort(()=>Math.random()-0.5);}h+=`<div class="drop-container"><div class="source-list">${s.map(p=>`<div class="draggable" draggable="true">${p}</div>`).join('')}</div><div class="target-list"></div></div>`;}h+=`<div class="feedback"></div></div>`;c.innerHTML+=h;});setupDragAndDrop();}
    function setupDragAndDrop() { const d=document.querySelectorAll('.draggable'),c=document.querySelectorAll('.source-list, .target-list');d.forEach(dr=>{dr.addEventListener('dragstart',()=>dr.classList.add('dragging'));dr.addEventListener('dragend',()=>dr.classList.remove('dragging'));});c.forEach(co=>{co.addEventListener('dragover',e=>{e.preventDefault();const a=getDragAfterElement(co,e.clientY),dr=document.querySelector('.dragging');if(a==null){co.appendChild(dr);}else{co.insertBefore(dr,a);}co.classList.add('over');});co.addEventListener('dragleave',()=>co.classList.remove('over'));co.addEventListener('drop',()=>co.classList.remove('over'));});}
    function getDragAfterElement(c,y){const d=[...c.querySelectorAll('.draggable:not(.dragging)')];return d.reduce((cl,ch)=>{const b=ch.getBoundingClientRect(),o=y-b.top-b.height/2;if(o<0&&o>cl.offset){return{offset:o,element:ch};}else{return cl;}},{offset:Number.NEGATIVE_INFINITY}).element;}
    document.querySelectorAll('.set-btn').forEach(b=>{b.addEventListener('click',(e)=>{document.querySelectorAll('.set-btn').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');laadSimulatieVragen(e.target.dataset.set);});});
    function init() { vulDichtheidTabel(); laadTheorieVragen(); laadControleVragen(); document.querySelector('.set-btn[data-set="1"]').classList.add('active'); laadSimulatieVragen(1); }
    init();
});
