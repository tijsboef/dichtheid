document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // 1. STATE MANAGEMENT & CONFIG
    // =================================================================================
    const APP_VERSION = "1.7"; // Verhoogd om localStorage te resetten
    let appState = {};
    const MAX_COMPLETIONS = 4;

    const defaultState = {
        appVersion: APP_VERSION,
        currentSectionIndex: 0,
        totalCompletions: 0,
        sections: [
            { id: 'theorie', title: 'Sectie 1: De Basis van Dichtheid', isComplete: false, attempts: 0 },
            { id: 'simulatie', title: 'Sectie 2: Oefenen met de Simulatie', isComplete: false, attempts: 0 },
            { id: 'controle', title: 'Sectie 3: Controlevragen', isComplete: false, attempts: 0 }
        ],
        activeQuestionIds: {
            theorie: [],
            simulatie: {},
            controle: []
        }
    };

    function saveState() {
        localStorage.setItem('dichtheidAppState', JSON.stringify(appState));
    }

    function loadState() {
        const savedStateJSON = localStorage.getItem('dichtheidAppState');
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON);
            if (savedState.appVersion !== APP_VERSION) {
                localStorage.removeItem('dichtheidAppState');
                appState = JSON.parse(JSON.stringify(defaultState));
            } else {
                appState = savedState;
            }
        } else {
            appState = JSON.parse(JSON.stringify(defaultState));
        }
    }

    // =================================================================================
    // 2. VRAGEN DATABASE & DATA
    // =================================================================================
    const dichtheidTabelData = [
        { stof: "Lucht", dichtheid: "0.0013" }, { stof: "Kurk", dichtheid: "0.25" }, { stof: "Hout", dichtheid: "0.40" },
        { stof: "Benzine", dichtheid: "0.72" }, { stof: "Alcohol", dichtheid: "0.80" }, { stof: "Spiritus", dichtheid: "0.80" },
        { stof: "IJs", dichtheid: "0.92" }, { stof: "Mens", dichtheid: "0.95" }, { stof: "Water", dichtheid: "1.00" },
        { stof: "Perspex", dichtheid: "1.2" }, { stof: "Suiker", dichtheid: "1.58" }, { stof: "Keukenzout", dichtheid: "2.17" },
        { stof: "Glas", dichtheid: "2.6" }, { stof: "Aluminium", dichtheid: "2.70" }, { stof: "Diamant", dichtheid: "3.51" },
        { stof: "Titanium", dichtheid: "4.50" }, { stof: "Tin", dichtheid: "7.28" }, { stof: "Staal", dichtheid: "7.80" },
        { stof: "IJzer", dichtheid: "7.87" }, { stof: "Koper", dichtheid: "8.96" }, { stof: "Lood", dichtheid: "11.32" },
        { stof: "Goud", dichtheid: "19.32" }, { stof: "Kwik", dichtheid: "13.5" }
    ];
    const grootheden = ['ρ', 'm', 'V'], eenheden = ['g', 'kg', 'cm³', 'L', 'g/cm³', 'kg/L'], operatoren = ['/', '*', '+', '-'];

    const questionDB = {
        theorie: [
            { id: 't1_v1', type: 'mc', prompt: "Wat beschrijft dichtheid het best?", options: ["De zwaarte van een object", "Massa per volume-eenheid", "De grootte van een object"], answer: "Massa per volume-eenheid", hints: ["Denk aan de eenheid: g/cm³.", "Het is een verhouding.", "Dichtheid is massa gedeeld door..."] },
            { id: 't1_v2', type: 'mc', prompt: "Als twee blokken hetzelfde volume hebben, maar blok A is zwaarder, wat kun je zeggen over de dichtheid?", options: ["Blok A heeft een lagere dichtheid", "Blok B heeft een hogere dichtheid", "Blok A heeft een hogere dichtheid"], answer: "Blok A heeft een hogere dichtheid", hints: ["Meer massa in hetzelfde volume betekent...", "De formule is ρ = m / V.", "Als 'm' groter is en 'V' gelijk, wat gebeurt er dan met 'ρ'?"] },
            { id: 't2_v1', type: 'formula', prompt: "Stel de formule voor dichtheid samen.", answer: "ρ=m/V", hints: ["ρ (rho) is het symbool voor dichtheid.", "Massa wordt gedeeld door volume.", "De formule is rho = m / V."] },
            { id: 't2_v2', type: 'mc', prompt: "Welke formule gebruik je om de massa (m) te berekenen als je de dichtheid (ρ) en het volume (V) weet?", options: ["m = V / ρ", "m = ρ / V", "m = ρ * V"], answer: "m = ρ * V", hints: ["De basisformule is ρ = m / V.", "Je moet de formule omschrijven.", "Vermenigvuldig beide kanten van de basisformule met V."] },
            { id: 't3_v1', type: 'sort', prompt: "Zet het stappenplan in de juiste volgorde.", items: ["Gegevens noteren", "Formule noteren", "Formule invullen", "Antwoord + eenheid"], answer: "gegevens noteren,formule noteren,formule invullen,antwoord + eenheid", hints: ["Je begint altijd met inventariseren.", "De formule komt vóór het invullen.", "Het antwoord is de laatste stap."] }
        ],
        simulatie: {
            set1: [{id:'s1_1', type: 'stappenplan', k:'Paars',m:'19.3',v:'5.5',d:'3.51', stof:'Diamant'},{id:'s1_2', type: 'stappenplan', k:'Blauw',m:'0.4',v:'1',d:'0.40', stof:'Hout'},{id:'s1_3', type: 'stappenplan', k:'Geel',m:'19.32',v:'1',d:'19.32', stof:'Goud'},{id:'s1_4', type: 'stappenplan', k:'Rood',m:'5',v:'5',d:'1.00', stof:'Water'},{id:'s1_5', type: 'stappenplan', k:'Groen',m:'2.8',v:'7',d:'0.40', stof:'Hout'}],
            set2: [{id:'s2_1', type: 'stappenplan', k:'Lichtbruin',m:'18',v:'1.59',d:'11.32', stof:'Lood'},{id:'s2_2', type: 'stappenplan', k:'Donkerbruin',m:'10.8',v:'4',d:'2.70', stof:'Aluminium'},{id:'s2_3', type: 'stappenplan', k:'Groen',m:'2.7',v:'1',d:'2.70', stof:'Aluminium'},{id:'s2_4', type: 'stappenplan', k:'Roze',m:'18',v:'4',d:'4.50', stof:'Titanium'},{id:'s2_5', type: 'stappenplan', k:'Lila',m:'44.8',v:'5',d:'8.96', stof:'Koper'}],
            set3: [{id:'s3_1', type: 'stappenplan', k:'Bordeaux',m:'2.85',v:'3',d:'0.95', stof:'Mens'},{id:'s3_2', type: 'stappenplan', k:'Grijs',m:'6',v:'6',d:'1.00', stof:'Water'},{id:'s3_3', type: 'stappenplan', k:'Beige',m:'23.4',v:'3',d:'7.80', stof:'Staal'},{id:'s3_4', type: 'stappenplan', k:'Camel',m:'2',v:'5',d:'0.40', stof:'Hout'},{id:'s3_5', type: 'stappenplan', k:'Wit',m:'6',v:'6.32',d:'0.95', stof:'Mens'}]
        },
        controle: [
            { id: 'c1_v1', type: 'stappenplan', prompt: "Een blokje heeft 270 g massa en 100 cm³ volume. Bereken de dichtheid.", data: {m:'270', v:'100'}, answer: '2.7', hints: ["Formule: ρ = m / V.", "Deel 270 door 100.", "Het antwoord is 2,7 g/cm³."]},
            { id: 'c1_v2', type: 'stappenplan', prompt: "Een object van 0.8 kg heeft een volume van 1 L. Bereken de dichtheid in g/cm³.", data: {m:'800', v:'1000'}, answer: '0.8', hints: ["Reken eerst de eenheden om! 1 kg = 1000 g, 1 L = 1000 cm³.", "Deel 800 door 1000.", "De dichtheid is 0,8 g/cm³."]},
            { id: 'c2_v1', type: 'stappenplan', prompt: "Een gouden ring heeft 2 cm³ volume. Bereken de massa. Zoek de dichtheid van goud op in de tabel.", data: {p:'19.32', v:'2'}, answer: '38.64', hints: ["Zoek eerst de dichtheid van goud.", "Formule: m = ρ * V.", "Vermenigvuldig 19,32 met 2."]},
            { id: 'c2_v2', type: 'stappenplan', prompt: "Een koperen draad heeft een volume van 10 cm³. Bereken de massa.", data: {p:'8.96', v:'10'}, answer: '89.6', hints: ["Zoek de dichtheid van koper in de tabel.", "Gebruik m = ρ * V.", "Het antwoord is 89,6 g."]},
            { id: 'c3_v1', type: 'stappenplan', prompt: "Een blokje van 780 g heeft 100 cm³ volume. Bereken de dichtheid en benoem het materiaal.", data: {m:'780', v:'100'}, answer: '7.8', stof: 'Staal', hints: ["Bereken eerst de dichtheid.", "Vergelijk je antwoord met de tabel.", "De dichtheid is 7,8 g/cm³, wat staal is."]},
            { id: 'c3_v2', type: 'stappenplan', prompt: "Een blokje van 270 g heeft 100 cm³ volume. Bereken de dichtheid en benoem het materiaal.", data: {m:'270', v:'100'}, answer: '2.7', stof: 'Aluminium', hints: ["Dichtheid is massa gedeeld door volume.", "Je berekent 2,7 g/cm³.", "Kijk in de tabel welke stof dit is."]}
        ]
    };

    const mainTitle = document.getElementById('main-title');
    const contentSections = document.querySelectorAll('.content-sectie');
    const navButtons = document.querySelectorAll('.nav-btn');
    const checkBtn = document.getElementById('check-answers-btn');
    const nextBtn = document.getElementById('volgende-sectie-btn');
    const prevBtn = document.getElementById('vorige-sectie-btn');
    const modal = document.getElementById('dichtheid-modal');
    
    function init() {
        loadState();
        if (appState.totalCompletions >= MAX_COMPLETIONS) {
            localStorage.removeItem('dichtheidAppState');
            localStorage.removeItem('dichtheidCompletions');
            window.location.reload();
            return;
        }
        if (!appState.activeQuestionIds.theorie.length) { 
            setupNewSession();
        }
        renderCurrentSection();
        updateUI();
    }
    
    function setupNewSession() {
        const completions = parseInt(localStorage.getItem('dichtheidCompletions') || 0);
        appState = JSON.parse(JSON.stringify(defaultState)); 
        appState.totalCompletions = completions;

        const uniqueGroupsT = groupByPrefix(questionDB.theorie.map(q => q.id));
        appState.activeQuestionIds.theorie = uniqueGroupsT.map(g => g[Math.floor(Math.random() * g.length)]);

        const uniqueGroupsC = groupByPrefix(questionDB.controle.map(q => q.id));
        appState.activeQuestionIds.controle = uniqueGroupsC.map(g => g[Math.floor(Math.random() * g.length)]);

        for (let i = 1; i <= 3; i++) {
            appState.activeQuestionIds.simulatie[`set${i}`] = [...questionDB.simulatie[`set${i}`]].sort(() => 0.5 - Math.random()).slice(0, 3).map(q => q.id);
        }
        saveState();
    }
    
    function updateUI() {
        mainTitle.textContent = appState.currentSectionIndex < 3 ? appState.sections[appState.currentSectionIndex].title : "🏆 Resultaten";
        document.getElementById('completion-counter').textContent = `Voltooid: ${appState.totalCompletions} keer`;
        
        contentSections.forEach((sec, i) => sec.classList.toggle('active', i === appState.currentSectionIndex));

        navButtons.forEach((btn, i) => {
            if (i < 3) {
                const section = appState.sections[i];
                btn.disabled = i > 0 && !appState.sections[i-1].isComplete;
                btn.classList.toggle('active', i === appState.currentSectionIndex);
                
                let score = 0;
                if(section.isComplete) {
                    score = Math.max(10, 100 - (section.attempts - 1) * 25);
                }
                const progressBar = btn.querySelector('.progress-bar');
                progressBar.style.width = `${score}%`;
                progressBar.style.backgroundColor = score > 75 ? 'var(--success-green)' : score > 25 ? 'var(--warning-yellow)' : 'var(--danger-red)';

            } else {
                 btn.disabled = !appState.sections[2].isComplete;
                 btn.classList.toggle('active', appState.currentSectionIndex === 3);
            }
        });
        
        const currentSectionIsComplete = appState.sections[appState.currentSectionIndex]?.isComplete;
        checkBtn.style.display = currentSectionIsComplete || appState.currentSectionIndex >= 3 ? 'none' : 'inline-block';
        nextBtn.style.display = currentSectionIsComplete && appState.currentSectionIndex < 3 ? 'inline-block' : 'none';
        prevBtn.style.display = appState.currentSectionIndex > 0 ? 'inline-block' : 'none';

        if (appState.currentSectionIndex >= 3) {
            renderResults();
        }
    }

    function renderResults() {
        const container = document.getElementById('resultaten-overzicht');
        container.innerHTML = '';
        appState.sections.forEach(sec => {
            const score = Math.max(0, 100 - (sec.attempts - 1) * 25);
            container.innerHTML += `<div class="resultaat-item ${score === 100 ? 'perfect' : ''}"><span>${sec.title}</span><span class="resultaat-percentage">${score}%</span></div>`;
        });
        const totalScore = Math.round(appState.sections.reduce((acc, s) => acc + Math.max(0, 100 - (s.attempts - 1) * 25), 0) / 3);
        container.innerHTML += `<div class="resultaat-item"><span><strong>Totaalscore</strong></span><span class="resultaat-percentage">${totalScore}%</span></div><p>Fantastisch werk! Klik hieronder om de module opnieuw te starten met een nieuwe set vragen.</p>`;
    }

    function checkAnswers() {
        const section = appState.sections[appState.currentSectionIndex];
        let allCorrect = true;

        const questionsContainer = document.getElementById(`${section.id}-vragen`);
        const exerciseElements = questionsContainer.querySelectorAll('.exercise');

        exerciseElements.forEach(exEl => {
            const qId = exEl.dataset.questionId;
            const questionData = findQuestionById(qId);
            const userAnswer = getUserAnswer(exEl, questionData.type);
            const isCorrect = checkAnswer(userAnswer, questionData);
            
            const feedbackEl = exEl.querySelector('.feedback');
            const attempts = parseInt(exEl.dataset.attempts) + 1;
            exEl.dataset.attempts = attempts;
            
            if(isCorrect) {
                feedbackEl.innerHTML = `✅ Correct!`;
                feedbackEl.className = 'feedback correct';
                exEl.style.borderColor = 'var(--success-green)';
            } else {
                allCorrect = false;
                let hintHTML = '';
                if (questionData.hints) {
                    if (attempts === 2) hintHTML = `<div class="hint">💡 Hint 1: ${questionData.hints[0]}</div>`;
                    if (attempts === 3) hintHTML = `<div class="hint">💡 Hint 2: ${questionData.hints[1]}</div>`;
                    if (attempts >= 4) hintHTML = `<div class="hint">💡 Antwoord: ${questionData.hints[2]}</div>`;
                }
                feedbackEl.innerHTML = `❌ Probeer het nog eens. ${hintHTML}`;
                feedbackEl.className = 'feedback incorrect';
            }
            feedbackEl.style.display = 'block';
        });
        
        if (allCorrect) {
            section.isComplete = true;
            section.attempts = section.attempts || 1;
        } else {
            section.attempts = (section.attempts || 0) + 1;
        }
        saveState();
        updateUI();
    }
    
    function getUserAnswer(exerciseEl, type) {
        if (type === 'mc') {
            const select = exerciseEl.querySelector('select');
            return select ? select.value : "";
        }
        if (type === 'formula') {
            const selects = exerciseEl.querySelectorAll('select');
            return `${selects[0].value}=${selects[1].value}/${selects[2].value}`;
        }
        if (type === 'sort') {
            // GECORRIGEERDE LOGICA HIER: .trim() toegevoegd
            return Array.from(exerciseEl.querySelectorAll('.target-list .draggable')).map(d => d.textContent.trim()).join(',');
        }
        if (type === 'stappenplan') {
            const antwoord = exerciseEl.querySelector('.antwoord-input')?.value.trim();
            const stofInput = exerciseEl.querySelector('.stof-input');
            const stof = stofInput ? stofInput.value.trim() : null;
            return { antwoord, stof };
        }
        return '';
    }

    function checkAnswer(userAnswer, questionData) {
        if (questionData.type === 'stappenplan') {
            let isCorrect = compareNumericAnswers(userAnswer.antwoord, questionData.answer || questionData.d);
            if (questionData.stof) {
                isCorrect = isCorrect && userAnswer.stof.toLowerCase() === questionData.stof.toLowerCase();
            }
            return isCorrect;
        } else {
            // GECORRIGEERDE LOGICA HIER: vervangt spaties en vergelijkt
            const formattedUserAnswer = userAnswer.toLowerCase().replace(/\s/g, '');
            const formattedCorrectAnswer = questionData.answer.toLowerCase().replace(/\s/g, '');
            return formattedUserAnswer === formattedCorrectAnswer;
        }
    }

    function compareNumericAnswers(userStr, correctStr) {
        if (!userStr || !correctStr) return false;
        const userNum = parseFloat(userStr.replace(',', '.'));
        const correctNum = parseFloat(correctStr);

        if (isNaN(userNum) || isNaN(correctNum)) return false;
        
        const tolerance = 0.02; 
        return Math.abs(userNum - correctNum) <= tolerance;
    }

    function renderCurrentSection() {
        const section = appState.sections[appState.currentSectionIndex];
        if (!section) return; 
        const container = document.getElementById(`${section.id}-vragen`);
        if (!container) return;
        container.innerHTML = '';
        if (section.id === 'simulatie') {
            const activeSet = document.querySelector('.set-btn.active')?.dataset.set || '1';
            const questionIds = appState.activeQuestionIds.simulatie[`set${activeSet}`];
            const questions = questionDB.simulatie[`set${activeSet}`].filter(q => questionIds.includes(q.id));
            questions.forEach(q => container.innerHTML += generateQuestionHTML(q));
        } else {
            const questionIds = appState.activeQuestionIds[section.id];
            const questions = questionDB[section.id].filter(q => questionIds.includes(q.id));
            questions.forEach(q => container.innerHTML += generateQuestionHTML(q));
        }
        setupDragAndDrop();
    }
    function generateQuestionHTML(q) {
        let content = '';
        if (q.type === 'mc') { const optionsHTML = q.options.map(opt => `<option value="${opt}">${opt}</option>`).join(''); content = `<select><option value="">Kies een antwoord...</option>${optionsHTML}</select>`;
        } else if (q.type === 'formula') { const parts = ['ρ', 'm', 'V']; const createSelect = () => `<select><option value="">?</option>${parts.map(p => `<option value="${p}">${p}</option>`).join('')}</select>`; content = `<div class="formula-wrapper"><div class="formula-part">${createSelect()}</div><span class="equals">=</span><div class="formula-fraction"><div class="numerator">${createSelect()}</div><div class="denominator">${createSelect()}</div></div></div>`;
        } else if (q.type === 'sort') { let s = [...q.items]; while (s.join(',') === q.answer) { s.sort(() => 0.5 - Math.random()); } content = `<div class="drop-container"><div class="source-list">${s.map(i => `<div class="draggable" draggable="true">${i}</div>`).join('')}</div><div class="target-list"></div></div>`;
        } else { const stofInput = q.stof ? `<hr><div class="stap-rij"><label>De stof is:</label><input class="stof-input" type="text" placeholder="Naam materiaal"></div>` : ''; content = `<div class="stappenplan-container"><div class="stap-rij"><label>Stap 1:</label>${createDropdown(grootheden)}<span>=</span><input type="text" placeholder="waarde">${createDropdown(eenheden)}</div><div class="stap-rij"><label></label>${createDropdown(grootheden)}<span>=</span><input type="text" placeholder="waarde">${createDropdown(eenheden)}</div><div class="stap-rij"><label>Stap 2:</label>${createDropdown(grootheden)}<span>=</span>${createDropdown(grootheden)}${createDropdown(operatoren)}${createDropdown(grootheden)}</div><div class="stap-rij"><label>Stap 3:</label>${createDropdown(grootheden)}<span>=</span><input type="text" placeholder="waarde">${createDropdown(operatoren)}<input type="text" placeholder="waarde"></div><div class="stap-rij"><label>Stap 4:</label>${createDropdown(grootheden)}<span>=</span><input class="antwoord-input" type="text" placeholder="antwoord">${createDropdown(eenheden)}</div>${stofInput}</div>`; }
        return `<div class="exercise" data-question-id="${q.id}" data-attempts="0"><h3>${q.prompt || `Bereken de dichtheid van het ${q.k}e blok.`}</h3>${content}<div class="feedback"></div></div>`;
    }
    function findQuestionById(id) { for (const category in questionDB) { if(category === 'simulatie') { for (const set in questionDB.simulatie) { const found = questionDB.simulatie[set].find(q => q.id === id); if (found) return found; } } else { const found = questionDB[category].find(q => q.id === id); if (found) return found; } } }
    function groupByPrefix(arr) { const map = arr.reduce((acc, val) => { const prefix = val.slice(0, 2); (acc[prefix] = acc[prefix] || []).push(val); return acc; }, {}); return Object.values(map); }
    function createDropdown(options) { let h = `<select><option value="">kies...</option>`; options.forEach(o => h += `<option value="${o}">${o}</option>`); return h + `</select>`; }
    function setupDragAndDrop() { const d=document.querySelectorAll('.draggable'),c=document.querySelectorAll('.source-list, .target-list');d.forEach(dr=>{dr.addEventListener('dragstart',()=>dr.classList.add('dragging'));dr.addEventListener('dragend',()=>dr.classList.remove('dragging'));});c.forEach(co=>{co.addEventListener('dragover',e=>{e.preventDefault();const a=getDragAfterElement(co,e.clientY),dr=document.querySelector('.dragging');if(a==null){co.appendChild(dr);}else{co.insertBefore(dr,a);}co.classList.add('over');});co.addEventListener('dragleave',()=>co.classList.remove('over'));co.addEventListener('drop',()=>co.classList.remove('over'));});}
    function getDragAfterElement(c,y){const d=[...c.querySelectorAll('.draggable:not(.dragging)')];return d.reduce((cl,ch)=>{const b=ch.getBoundingClientRect(),o=y-b.top-b.height/2;if(o<0&&o>cl.offset){return{offset:o,element:ch};}else{return cl;}},{offset:Number.NEGATIVE_INFINITY}).element;}
    checkBtn.addEventListener('click', checkAnswers);
    nextBtn.addEventListener('click', () => { if (appState.currentSectionIndex < 3) { if (appState.currentSectionIndex === 2) { appState.totalCompletions++; localStorage.setItem('dichtheidCompletions', appState.totalCompletions); } appState.currentSectionIndex++; renderCurrentSection(); saveState(); updateUI(); } });
    prevBtn.addEventListener('click', () => { if (appState.currentSectionIndex > 0) { appState.currentSectionIndex--; renderCurrentSection(); saveState(); updateUI(); } });
    navButtons.forEach(btn => btn.addEventListener('click', (e) => { const targetIndex = parseInt(e.currentTarget.dataset.section); if(!btn.disabled) { appState.currentSectionIndex = targetIndex; renderCurrentSection(); saveState(); updateUI(); } }));
    document.querySelectorAll('.set-btn').forEach(btn => btn.addEventListener('click', (e) => { document.querySelectorAll('.set-btn').forEach(b => b.classList.remove('active')); e.target.classList.add('active'); renderCurrentSection(); }));
    document.getElementById('reset-btn')?.addEventListener('click', () => { appState.currentSectionIndex = 0; setupNewSession(); renderCurrentSection(); updateUI(); });
    document.getElementById('toggle-table-btn').onclick = () => modal.style.display = "block";
    document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
    function vulDichtheidTabel() { const t=document.getElementById('dichtheid-tabel'); t.innerHTML='<tr><th>Stof</th><th>Dichtheid (g/cm³)</th></tr>'; dichtheidTabelData.forEach(i=>{t.innerHTML+=`<tr><td>${i.stof}</td><td>${i.dichtheid}</td></tr>`;});}
    vulDichtheidTabel();
    init();
});
