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
    
    // Data voor Sectie 2
    const metingen = {
        set1: [ { id: '1A', kleur: 'Paars', massa: '19.3', volume: '5.5', dichtheid: '3.51' }, { id: '1B', kleur: 'Blauw', massa: '0.4', volume: '1', dichtheid: '0.40' }, { id: '1C', kleur: 'Geel', massa: '19.32', volume: '1', dichtheid: '19.32' } ],
        set2: [ { id: '2A', kleur: 'Lichtbruin', massa: '18', volume: '1.59', dichtheid: '11.32' }, { id: '2B', kleur: 'Donkerbruin', massa: '10.8', volume: '4', dichtheid: '2.70' }, { id: '2C', kleur: 'Groen', massa: '2.7', volume: '1', dichtheid: '2.70' } ],
        set3: [ { id: '3A', kleur: 'Bordeaux', massa: '2.85', volume: '3', dichtheid: '0.95' }, { id: '3B', kleur: 'Grijs', massa: '6', volume: '6', dichtheid: '1.00' }, { id: '3C', kleur: 'Beige', massa: '23.4', volume: '3', dichtheid: '7.80' } ]
    };
    
    // --- NIEUWE DATA VOOR SECTIE 3 ---
    const controleVragenData = [
        { vraag: "Een blokje heeft een massa van 270 g en een volume van 100 cm³. Bereken de dichtheid.", teVinden: "dichtheid", data: { m: "270", v: "100" }, antwoord: "2.7" },
        { vraag: "Een gouden ring heeft een dichtheid van 19,3 g/cm³ en een volume van 2 cm³. Bereken de massa.", teVinden: "massa", data: { p: "19.3", v: "2" }, antwoord: "38.6" },
        { vraag: "Een blokje met een dichtheid van 2,5 g/cm³ heeft een massa van 500 g. Bereken het volume.", teVinden: "volume", data: { p: "2.5", m: "500" }, antwoord: "200" },
        { vraag: "Bereken de dichtheid van 1,5 L benzine met een massa van 1080 g. Let op: reken L eerst om naar cm³!", teVinden: "dichtheid", data: { m: "1080", v: "1500" }, antwoord: "0.72" },
        { vraag: "Bereken het volume van 1 kg staal (dichtheid 7,8 g/cm³). Let op: reken kg eerst om naar g!", teVinden: "volume", data: { p: "7.8", m: "1000" }, antwoord: "128.21" }
    ];

    // Data voor dropdowns in stappenplan
    const grootheden = ['ρ', 'm', 'V'];
    const eenheden = ['g', 'kg', 'cm³', 'dm³', 'L', 'm³', 'g/cm³', 'kg/L'];
    const operatoren = ['/', '*', '+', '-'];

    // --- ELEMENTEN & NAVIGATIE ETC. (ongewijzigd) ---
    const secties = document.querySelectorAll('.content-sectie');
    const volgendeBtn = document.getElementById('volgende-sectie-btn');
    const checkBtns = document.querySelectorAll('.check-answers');
    let huidigeSectieIndex = 0;
    const modal = document.getElementById('dichtheid-modal');
    document.getElementById('toggle-table-btn').onclick = () => modal.style.display = "block";
    document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
    volgendeBtn.addEventListener('click', () => {
        if (huidigeSectieIndex < secties.length - 1) {
            secties[huidigeSectieIndex].style.display = 'none';
            huidigeSectieIndex++;
            secties[huidigeSectieIndex].style.display = 'block';
            if (huidigeSectieIndex === secties.length - 1) {
                volgendeBtn.style.display = 'none';
            }
        }
    });
    
    function createDropdown(options) {
        let html = `<select><option value="">kies...</option>`;
        options.forEach(opt => html += `<option value="${opt}">${opt}</option>`);
        html += `</select>`;
        return html;
    }

    // --- VRAGEN GENERATORS (NU OOK AANGEPAST VOOR SECTIE 3) ---
    
    // Generator voor Sectie 2
    function laadSimulatieVragen(setNum) {
        const container = document.getElementById('simulatie-vragen');
        container.innerHTML = '';
        const setVragen = metingen[`set${setNum}`];
        setVragen.forEach((q, i) => {
            const antwoordStof = dichtheidTabelData.find(s => s.dichtheid == q.dichtheid)?.stof || 'Onbekend';
            container.innerHTML += buildStappenplanHTML(`sim-${setNum}-${i}`, `Vraag ${i + 1}: Het ${q.kleur}e Blok`, `Bepaal met de simulatie de massa en het volume van het <strong>${q.kleur}e blok</strong> (ID: ${q.id}) en bereken de dichtheid.`, { massa: q.massa, volume: q.volume, dichtheid: q.dichtheid, stof: antwoordStof });
        });
    }

    // Generator voor Sectie 3
    function laadControleVragen() {
        const container = document.getElementById('controle-vragen');
        container.innerHTML = '';
        const randomVragen = [...controleVragenData].sort(() => 0.5 - Math.random()).slice(0, 3);
        randomVragen.forEach((q, i) => {
            container.innerHTML += buildStappenplanHTML(`controle-${i}`, `Vraag ${i + 1}`, q.vraag, { massa: q.data.m, volume: q.data.v, dichtheid: q.data.p, antwoord: q.antwoord });
        });
    }

    // Helper functie die het stappenplan HTML bouwt
    function buildStappenplanHTML(id, titel, vraagTekst, data) {
        return `
        <div class="exercise" id="${id}" data-massa="${data.massa || ''}" data-volume="${data.volume || ''}" data-dichtheid="${data.dichtheid || ''}" data-stof="${data.stof || ''}" data-antwoord="${data.antwoord || data.dichtheid}">
            <h3>${titel}</h3>
            <p>${vraagTekst}</p>
            <div class="stappenplan-container">
                <div class="stap-rij"><label>Stap 1:</label>${createDropdown(grootheden)}<span class="equals">=</span><input type="text" placeholder="waarde">${createDropdown(eenheden)}</div>
                <div class="stap-rij"><label></label>${createDropdown(grootheden)}<span class="equals">=</span><input type="text" placeholder="waarde">${createDropdown(eenheden)}</div>
                <div class="stap-rij"><label>Stap 2:</label>${createDropdown(grootheden)}<span class="equals">=</span>${createDropdown(grootheden)}${createDropdown(operatoren)}${createDropdown(grootheden)}</div>
                <div class="stap-rij"><label>Stap 3:</label>${createDropdown(grootheden)}<span class="equals">=</span><input type="text" placeholder="waarde">${createDropdown(operatoren)}<input type="text" placeholder="waarde"></div>
                <div class="stap-rij"><label>Stap 4:</label>${createDropdown(grootheden)}<span class="equals">=</span><input type="text" placeholder="antwoord">${createDropdown(eenheden)}</div>
                ${data.stof ? `<hr><div class="stap-rij"><label>De stof is:</label><input type="text" placeholder="Naam materiaal"></div>` : ''}
            </div>
            <div class="feedback"></div>
        </div>`;
    }

    // --- OUDE FUNCTIES (ongewijzigd) ---
    function vulDichtheidTabel() {
        const tabel = document.getElementById('dichtheid-tabel'); tabel.innerHTML = '<tr><th>Materiaal</th><th>Dichtheid (kg/L of g/cm³)</th></tr>';
        dichtheidTabelData.sort((a, b) => a.stof.localeCompare(b.stof)).forEach(item => { tabel.innerHTML += `<tr><td>${item.stof}</td><td>${item.dichtheid}</td></tr>`; });
    }
    function laadTheorieVragen() {
        const container = document.getElementById('theorie-vragen'); container.innerHTML = '';
        theorieVragen.forEach((q, i) => {
            let html = `<div class="exercise" id="theorie-ex-${i}" data-answer="${q.antwoord}"><label>${i + 1}. ${q.vraag}</label>`;
            if (q.type === 'mc') {
                html += `<select><option value="">Kies...</option>`; q.opties.forEach(o => html += `<option value="${o}">${o}</option>`); html += `</select>`;
            } else if (q.type === 'formula') {
                const p=["dichtheid","massa","volume"], c=()=>{let s=`<select><option value="">kies...</option>`;p.forEach(p=>s+=`<option value="${p}">${p}</option>`);return s+`</select>`;};
                html += `<div class="formula-container">${c()} = ${c()} / ${c()}</div>`;
            } else if (q.type === 'sort') {
                let s=[...q.stappen];while(s.join(',')===q.stappen.join(',')){s.sort(()=>Math.random()-0.5);}
                html += `<div class="drop-container"><div class="source-list">${s.map(p=>`<div class="draggable" draggable="true">${p}</div>`).join('')}</div><div class="target-list"></div></div>`;
            } html += `<div class="feedback"></div></div>`; container.innerHTML += html;
        }); setupDragAndDrop();
    }
    function setupDragAndDrop() {
        const draggables = document.querySelectorAll('.draggable'), containers = document.querySelectorAll('.source-list, .target-list');
        draggables.forEach(d => {d.addEventListener('dragstart',()=>d.classList.add('dragging'));d.addEventListener('dragend',()=>d.classList.remove('dragging'));});
        containers.forEach(c=>{c.addEventListener('dragover',e=>{e.preventDefault();const a=getDragAfterElement(c,e.clientY),d=document.querySelector('.dragging');if(a==null){c.appendChild(d);}else{c.insertBefore(d,a);}c.classList.add('over');});c.addEventListener('dragleave',()=>c.classList.remove('over'));c.addEventListener('drop',()=>c.classList.remove('over'));});
    }
    function getDragAfterElement(container,y){const d=[...container.querySelectorAll('.draggable:not(.dragging)')];return d.reduce((c,ch)=>{const b=ch.getBoundingClientRect(),o=y-b.top-b.height/2;if(o<0&&o>c.offset){return{offset:o,element:ch};}else{return c;}},{offset:Number.NEGATIVE_INFINITY}).element;}

    // --- AANGEPASTE CONTROLE LOGICA ---
    checkBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectie = e.target.dataset.section;
            const exercises = document.querySelectorAll(`#${sectie}-sectie .exercise`);
            
            if (sectie === 'simulatie' || sectie === 'controle') {
                exercises.forEach(ex => {
                    const feedback = ex.querySelector('.feedback');
                    const correctAnswer = ex.dataset.antwoord;
                    const inputs = ex.querySelectorAll('input, select');
                    const userAnswer = inputs[12]?.value.trim().replace(',', '.'); // Antwoordveld op stap 4

                    feedback.style.display = 'block';
                    if (userAnswer === correctAnswer) {
                         feedback.textContent = `Helemaal correct! Het antwoord is ${correctAnswer}.`;
                         feedback.className = 'feedback correct';
                    } else {
                        feedback.textContent = `Helaas, het berekende antwoord is niet juist. Het juiste antwoord is ${correctAnswer}.`;
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

    // --- SIMULATIE SET KIEZEN ---
    document.querySelectorAll('.set-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.set-btn').forEach(b => b.classList.remove('active')); e.target.classList.add('active');
            laadSimulatieVragen(e.target.dataset.set);
        });
    });
    
    // --- INITIALISATIE ---
    function init() {
        vulDichtheidTabel();
        laadTheorieVragen();
        laadControleVragen();
        document.querySelector('.set-btn[data-set="1"]').classList.add('active');
        laadSimulatieVragen(1);
    }

    init();
});
