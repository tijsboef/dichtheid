document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // 1. STATE MANAGEMENT & CONFIG
    // =================================================================================
    const APP_VERSION = "1.6"; // Verhoogd om localStorage te resetten
    let appState = {};
    const MAX_COMPLETIONS = 4;

    const defaultState = {
        appVersion: APP_VERSION,
        currentSectionIndex: 0,
        totalCompletions: 0,
        sections: [
            { id: 'theorie', title: 'Sectie 1: De Basis van Dichtheid', isComplete: false, attempts: 0, questionsCorrect: 0, questionsTotal: 0 },
            { id: 'simulatie', title: 'Sectie 2: Oefenen met de Simulatie', isComplete: false, attempts: 0, currentQuestionIndex: 0, questions: [] },
            { id: 'controle', title: 'Sectie 3: Controlevragen', isComplete: false, attempts: 0, questionsCorrect: 0, questionsTotal: 0 }
        ]
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
    const dichtheidTabelData = [ { stof: "Hout", dichtheid: "0.40" }, { stof: "Benzine", dichtheid: "0.72" }, { stof: "IJs", dichtheid: "0.92" }, { stof: "Water", dichtheid: "1.00" }, { stof: "Aluminium", dichtheid: "2.70" }, { stof: "Staal", dichtheid: "7.80" }, { stof: "Koper", dichtheid: "8.96" }, { stof: "Lood", dichtheid: "11.32" }, { stof: "Goud", dichtheid: "19.32" }, { stof: "Diamant", dichtheid: "3.51" }, { stof: "Titanium", dichtheid: "4.50" }, { stof: "Mens", dichtheid: "0.95" } ];
    const grootheden = ['ρ', 'm', 'V'], eenheden = ['g', 'kg', 'cm³', 'L', 'g/cm³', 'kg/L'], operatoren = ['/', '*', '+', '-'];

    const questionDB = {
        theorie: [
            { id: 't1_v1', type: 'mc', prompt: "Wat beschrijft dichtheid het best?", options: ["De zwaarte van een object", "Massa per volume-eenheid", "De grootte van een object"], answer: "Massa per volume-eenheid", hints: ["Denk aan de eenheid: g/cm³.", "Het is een verhouding.", "Dichtheid is massa gedeeld door..."] },
            { id: 't2_v1', type: 'formula', prompt: "Stel de formule voor dichtheid samen.", answer: "ρ=m/V", hints: ["ρ (rho) is het symbool voor dichtheid.", "Massa wordt gedeeld door volume.", "De formule is rho = m / V."] },
            { id: 't3_v1', type: 'sort', prompt: "Zet het stappenplan in de juiste volgorde.", items: ["Gegevens noteren", "Formule noteren", "Formule invullen", "Antwoord + eenheid"], answer: "Gegevens noteren,Formule noteren,Formule invullen,Antwoord + eenheid", hints: ["Je begint altijd met inventariseren.", "De formule komt vóór het invullen.", "Het antwoord is de laatste stap."] }
        ],
        simulatie: {
            set1: [{id:'s1_1',set:1,type:'stappenplan',k:'Paars',m:'19.3',v:'5.5',d:'3.51',s:'Diamant'}, {id:'s1_2',set:1,type:'stappenplan',k:'Blauw',m:'0.4',v:'1',d:'0.40',s:'Hout'}, {id:'s1_3',set:1,type:'stappenplan',k:'Geel',m:'19.32',v:'1',d:'19.32',s:'Goud'}, {id:'s1_4',set:1,type:'stappenplan',k:'Rood',m:'5',v:'5',d:'1.00',s:'Water'}, {id:'s1_5',set:1,type:'stappenplan',k:'Groen',m:'2.8',v:'7',d:'0.40',s:'Hout'}],
            set2: [{id:'s2_1',set:2,type:'stappenplan',k:'Lichtbruin',m:'18',v:'1.59',d:'11.32',s:'Lood'}, {id:'s2_2',set:2,type:'stappenplan',k:'Donkerbruin',m:'10.8',v:'4',d:'2.70',s:'Aluminium'}, {id:'s2_3',set:2,type:'stappenplan',k:'Groen',m:'2.7',v:'1',d:'2.70',s:'Aluminium'}, {id:'s2_4',set:2,type:'stappenplan',k:'Roze',m:'18',v:'4',d:'4.50',s:'Titanium'}, {id:'s2_5',set:2,type:'stappenplan',k:'Lila',m:'44.8',v:'5',d:'8.96',s:'Koper'}],
            set3: [{id:'s3_1',set:3,type:'stappenplan',k:'Bordeaux',m:'2.85',v:'3',d:'0.95',s:'Mens'}, {id:'s3_2',set:3,type:'stappenplan',k:'Grijs',m:'6',v:'6',d:'1.00',s:'Water'}, {id:'s3_3',set:3,type:'stappenplan',k:'Beige',m:'23.4',v:'3',d:'7.80',s:'Staal'}, {id:'s3_4',set:3,type:'stappenplan',k:'Camel',m:'2',v:'5',d:'0.40',s:'Hout'}, {id:'s3_5',set:3,type:'stappenplan',k:'Wit',m:'6',v:'6.32',d:'0.95',s:'Mens'}]
        },
        controle: [
            { id: 'c1_v1', type: 'stappenplan', prompt: "Een blokje heeft 270 g massa en 100 cm³ volume. Bereken de dichtheid.", data: {m:'270', v:'100'}, answer: '2.7', hints: ["Formule: ρ = m / V.", "Deel 270 door 100.", "Het antwoord is 2,7 g/cm³."]},
            { id: 'c2_v1', type: 'stappenplan', prompt: "Een gouden ring heeft 2 cm³ volume. Bereken de massa. Zoek de dichtheid van goud op in de tabel.", data: {p:'19.32', v:'2'}, answer: '38.64', hints: ["Zoek eerst de dichtheid van goud.", "Formule: m = ρ * V.", "Vermenigvuldig 19,32 met 2."]},
            { id: 'c3_v1', type: 'stappenplan', prompt: "Een blokje van 780 g heeft 100 cm³ volume. Bereken de dichtheid en benoem het materiaal.", data: {m:'780', v:'100'}, answer: '7.8', stof: 'Staal', hints: ["Bereken eerst de dichtheid.", "Vergelijk je antwoord met de tabel.", "De dichtheid is 7,8 g/cm³, wat staal is."]}
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
        if (!appState.appVersion || appState.appVersion !== APP_VERSION) {
            setupNewSession();
        }
        if (appState.totalCompletions >= MAX_COMPLETIONS) {
            localStorage.removeItem('dichtheidAppState');
            localStorage.removeItem('dichtheidCompletions');
            window.location.reload(); return;
        }
        renderCurrentSection();
        updateUI();
    }
    
    function setupNewSession() {
        const completions = parseInt(localStorage.getItem('dichtheidCompletions') || 0);
        appState = JSON.parse(JSON.stringify(defaultState)); 
        appState.totalCompletions = completions;

        const allSimQuestions = [...questionDB.simulatie.set1, ...questionDB.simulatie.set2, ...questionDB.simulatie.set3];
        appState.sections[1].questions = allSimQuestions.sort(() => 0.5 - Math.random()).slice(0, 5).map(q => ({...q, attempts: 0, isCorrect: false, isAnswered: false}));

        const theorieVragen = groupByPrefix(questionDB.theorie.map(q => q.id)).map(g => g[Math.floor(Math.random() * g.length)]);
        appState.sections[0].questions = theorieVragen.map(id => ({...findQuestionById(id), id, attempts: 0, isCorrect: false}));
        appState.sections[0].questionsTotal = appState.sections[0].questions.length;

        const controleVragen = groupByPrefix(questionDB.controle.map(q => q.id)).map(g => g[Math.floor(Math.random() * g.length)]);
        appState.sections[2].questions = controleVragen.map(id => ({...findQuestionById(id), id, attempts: 0, isCorrect: false}));
        appState.sections[2].questionsTotal = appState.sections[2].questions.length;
        
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
                    if (section.id === 'simulatie') {
                        const correctCount = section.questions.filter(q => q.isCorrect).length;
                        score = (correctCount / section.questions.length) * 100;
                    } else {
                        score = Math.max(10, 100 - (section.attempts - 1) * 25);
                    }
                }
                const progressBar = btn.querySelector('.progress-bar');
                progressBar.style.width = `${score}%`;
                progressBar.style.backgroundColor = score >= 75 ? 'var(--success-green)' : score > 25 ? 'var(--warning-yellow)' : 'var(--danger-red)';
            } else {
                 btn.disabled = !appState.sections[2].isComplete;
                 btn.classList.toggle('active', appState.currentSectionIndex === 3);
            }
        });
        
        const currentSectionIsComplete = appState.sections[appState.currentSectionIndex]?.isComplete;
        checkBtn.style.display = currentSectionIsComplete || appState.currentSectionIndex >= 3 ? 'none' : 'inline-block';
        nextBtn.style.display = 'none'; // Wordt per vraag/sectie getoond
        prevBtn.style.display = appState.currentSectionIndex > 0 ? 'inline-block' : 'none';

        if (appState.currentSectionIndex === 1) { // Speciale logica voor simulatie
            const simSection = appState.sections[1];
            const currentQ = simSection.questions[simSection.currentQuestionIndex];
            if (currentQ.isAnswered) {
                checkBtn.style.display = 'none';
                nextBtn.style.display = 'inline-block';
                if (simSection.currentQuestionIndex >= simSection.questions.length - 1) {
                    nextBtn.textContent = 'Sectie Voltooien';
                } else {
                    nextBtn.textContent = 'Volgende Vraag';
                }
            }
        } else if (currentSectionIsComplete) {
            nextBtn.style.display = 'inline-block';
            nextBtn.textContent = 'Volgende Sectie';
        }

        if (appState.currentSectionIndex >= 3) {
            renderResults();
        }
    }

    function renderResults() {
        const container = document.getElementById('resultaten-overzicht');
        container.innerHTML = '';
        appState.sections.forEach(sec => {
            let score;
            if (sec.id === 'simulatie' || sec.id === 'controle') {
                const correctCount = sec.questions.filter(q => q.isCorrect).length;
                const total = sec.questions.length || sec.questionsTotal;
                score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
            } else { // Theorie
                score = sec.isComplete ? Math.max(0, 100 - (sec.attempts - 1) * 25) : 0;
            }
            container.innerHTML += `<div class="resultaat-item ${score === 100 ? 'perfect' : ''}"><span>${sec.title}</span><span class="resultaat-percentage">${score}%</span></div>`;
        });
    }

    function checkAnswers() {
        const section = appState.sections[appState.currentSectionIndex];
        
        if (section.id === 'simulatie') {
            checkSimulatieAnswer();
        } else {
            let allCorrect = true;
            const questionsContainer = document.getElementById(`${section.id}-vragen`);
            const exerciseElements = questionsContainer.querySelectorAll('.exercise');
            
            exerciseElements.forEach(exEl => {
                const qId = exEl.dataset.questionId;
                const questionData = findQuestionById(qId);
                const userAnswer = getUserAnswer(exEl, questionData.type);
                if (!checkAnswer(userAnswer, questionData)) allCorrect = false;
                displayFeedback(exEl, checkAnswer(userAnswer, questionData), questionData);
            });
            
            section.attempts = (section.attempts || 0) + 1;
            if (allCorrect) section.isComplete = true;
        }
        saveState();
        updateUI();
    }
    
    function checkSimulatieAnswer() {
        const section = appState.sections[1];
        const qIndex = section.currentQuestionIndex;
        const question = section.questions[qIndex];
        
        const container = document.getElementById('simulatie-vragen');
        const exEl = container.querySelector('.exercise');
        const userAnswer = getUserAnswer(exEl, 'stappenplan');
        
        const { densityCorrect, stofCorrect, isFullyCorrect } = checkAnswer(userAnswer, question);
        
        question.attempts++;
        question.isAnswered = true;

        if (isFullyCorrect) {
            question.isCorrect = true;
            displayFeedback(exEl, true, question);
        } else {
            question.isCorrect = false;
            displayGranularFeedback(exEl, densityCorrect, stofCorrect, question);
            if (question.attempts >= 3) {
                // Toon juiste antwoord
                const feedbackEl = exEl.querySelector('.feedback');
                feedbackEl.innerHTML += `<div class="hint">💡 Het juiste antwoord is <strong>${question.d} g/cm³</strong> voor de stof <strong>${question.s}</strong>.</div>`;
            }
        }

        if (section.questions.every(q => q.isAnswered)) {
            section.isComplete = true;
        }
    }

    function displayFeedback(el, isCorrect, qData) {
        const feedbackEl = el.querySelector('.feedback');
        el.dataset.attempts = (parseInt(el.dataset.attempts) || 0) + 1;
        
        if(isCorrect) {
            feedbackEl.innerHTML = `✅ Correct!`;
            feedbackEl.className = 'feedback correct';
            el.style.borderColor = 'var(--success-green)';
        } else {
            let hintHTML = '';
            if (qData.hints) {
                const attempts = parseInt(el.dataset.attempts);
                if (attempts === 2) hintHTML = `<div class="hint">💡 Hint 1: ${qData.hints[0]}</div>`;
                if (attempts === 3) hintHTML = `<div class="hint">💡 Hint 2: ${qData.hints[1]}</div>`;
                if (attempts >= 4) hintHTML = `<div class="hint">💡 Antwoord: ${qData.hints[2]}</div>`;
            }
            feedbackEl.innerHTML = `❌ Probeer het nog eens. ${hintHTML}`;
            feedbackEl.className = 'feedback incorrect';
        }
        feedbackEl.style.display = 'block';
    }

    function displayGranularFeedback(el, densityCorrect, stofCorrect, qData) {
        const feedbackEl = el.querySelector('.feedback');
        let feedbackHTML = '';

        if (densityCorrect) {
            feedbackHTML += `✅ Je berekening van de dichtheid is correct!<br>`;
        } else {
            feedbackHTML += `❌ De berekende dichtheid klopt niet. `;
        }

        if (stofCorrect) {
            feedbackHTML += `✅ De naam van de stof is correct!`;
        } else {
            feedbackHTML += `❌ De naam van de stof klopt niet.`;
        }
        
        if (qData.attempts >= 2) {
            feedbackHTML += `<div class="hint">💡 Hint: Controleer je meting van massa en volume in de simulatie en vergelijk de berekende dichtheid goed met de tabel.</div>`
        }

        feedbackEl.innerHTML = feedbackHTML;
        feedbackEl.className = 'feedback incorrect';
        feedbackEl.style.display = 'block';
    }

    function getUserAnswer(exerciseEl, type) {
        if (type === 'mc') return exerciseEl.querySelector('select')?.value || "";
        if (type === 'formula') { const s = exerciseEl.querySelectorAll('select'); return `${s[0].value}=${s[1].value}/${s[2].value}`; }
        if (type === 'sort') return Array.from(exerciseEl.querySelectorAll('.target-list .draggable')).map(d => d.textContent).join(',');
        if (type === 'stappenplan') {
            const antwoord = exerciseEl.querySelector('.antwoord-input')?.value.trim();
            const stof = exerciseEl.querySelector('.stof-input')?.value.trim();
            return { antwoord, stof };
        }
        return '';
    }

    function checkAnswer(userAnswer, questionData) {
        if (questionData.type === 'stappenplan') {
            const densityCorrect = compareNumericAnswers(userAnswer.antwoord, questionData.d);
            const stofCorrect = userAnswer.stof.toLowerCase() === questionData.s.toLowerCase();
            return { densityCorrect, stofCorrect, isFullyCorrect: densityCorrect && stofCorrect };
        } else {
            return userAnswer.toLowerCase() === questionData.answer.toLowerCase();
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
            document.querySelector('.set-selector').style.display = 'none';
            const q = section.questions[section.currentQuestionIndex];
            container.innerHTML += generateQuestionHTML(q);
        } else {
            document.querySelector('.set-selector').style.display = 'none';
            section.questions.forEach(q => container.innerHTML += generateQuestionHTML(q));
        }
        setupDragAndDrop();
    }

    function generateQuestionHTML(q) {
        let content = '';
        if (q.type === 'mc') { content = `<select><option value="">Kies...</option>${q.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select>`;
        } else if (q.type === 'formula') { const p = ['ρ', 'm', 'V']; const cS=()=>`<select><option value="">?</option>${p.map(i => `<option value="${i}">${i}</option>`).join('')}</select>`; content = `<div class="formula-wrapper"><div class="formula-part">${cS()}</div><span class="equals">=</span><div class="formula-fraction"><div class="numerator">${cS()}</div><div class="denominator">${cS()}</div></div></div>`;
        } else if (q.type === 'sort') { let s = [...q.items]; while (s.join(',') === q.answer) { s.sort(() => 0.5 - Math.random()); } content = `<div class="drop-container"><div class="source-list">${s.map(i => `<div class="draggable" draggable="true">${i}</div>`).join('')}</div><div class="target-list"></div></div>`;
        } else { const stofInput = `<hr><div class="stap-rij"><label>De stof is:</label><input class="stof-input" type="text" placeholder="Naam materiaal"></div>`; content = `<div class="stappenplan-container"><div class="stap-rij"><label>Stap 1:</label>${createDropdown(grootheden)}<span>=</span><input type="text" placeholder="waarde">${createDropdown(eenheden)}</div><div class="stap-rij"><label></label>${createDropdown(grootheden)}<span>=</span><input type="text" placeholder="waarde">${createDropdown(eenheden)}</div><div class="stap-rij"><label>Stap 2:</label>${createDropdown(grootheden)}<span>=</span>${createDropdown(grootheden)}${createDropdown(operatoren)}${createDropdown(grootheden)}</div><div class="stap-rij"><label>Stap 3:</label>${createDropdown(grootheden)}<span>=</span><input type="text" placeholder="waarde">${createDropdown(operatoren)}<input type="text" placeholder="waarde"></div><div class="stap-rij"><label>Stap 4:</label>${createDropdown(grootheden)}<span>=</span><input class="antwoord-input" type="text" placeholder="antwoord">${createDropdown(eenheden)}</div>${stofInput}</div>`; }
        let prompt = q.prompt || `Bereken de dichtheid van het ${q.k}e blok.`;
        if (q.set) prompt = `<div class="instructies">Selecteer <strong>Set ${q.set}</strong> in de simulatie.</div>` + prompt;
        return `<div class="exercise" data-question-id="${q.id}" data-attempts="0"><h3>${prompt}</h3>${content}<div class="feedback"></div></div>`;
    }

    function findQuestionById(id) {
        for (const cat in questionDB) {
            if (cat === 'simulatie') {
                for (const set in questionDB.simulatie) {
                    const found = questionDB.simulatie[set].find(q => q.id === id); if (found) return found;
                }
            } else {
                const found = questionDB[cat].find(q => q.id === id); if (found) return found;
            }
        }
    }
    function groupByPrefix(arr) { const map = arr.reduce((acc, val) => { const p = val.slice(0, 2); (acc[p] = acc[p] || []).push(val); return acc; }, {}); return Object.values(map); }
    function createDropdown(options) { let h = `<select><option value="">kies...</option>`; options.forEach(o => h += `<option value="${o}">${o}</option>`); return h + `</select>`; }
    function setupDragAndDrop() { /* ... ongewijzigd ... */ }
    
    checkBtn.addEventListener('click', checkAnswers);
    nextBtn.addEventListener('click', () => {
        const section = appState.sections[appState.currentSectionIndex];
        if (section.id === 'simulatie') {
            if (section.currentQuestionIndex < section.questions.length - 1) {
                section.currentQuestionIndex++;
                renderCurrentSection();
            } else {
                section.isComplete = true;
                appState.currentSectionIndex++;
                renderCurrentSection();
            }
        } else {
            if (appState.currentSectionIndex === 2) { 
                appState.totalCompletions++; 
                localStorage.setItem('dichtheidCompletions', appState.totalCompletions); 
            }
            appState.currentSectionIndex++;
            renderCurrentSection();
        }
        saveState();
        updateUI();
    });
    prevBtn.addEventListener('click', () => { if (appState.currentSectionIndex > 0) { appState.currentSectionIndex--; renderCurrentSection(); saveState(); updateUI(); } });
    navButtons.forEach(btn => btn.addEventListener('click', (e) => { const i = parseInt(e.currentTarget.dataset.section); if(!btn.disabled) { appState.currentSectionIndex = i; renderCurrentSection(); saveState(); updateUI(); } }));
    document.getElementById('reset-btn')?.addEventListener('click', () => { appState.currentSectionIndex = 0; setupNewSession(); renderCurrentSection(); updateUI(); });
    document.getElementById('toggle-table-btn').onclick = () => modal.style.display = "block";
    document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
    function vulDichtheidTabel() { const t=document.getElementById('dichtheid-tabel'); t.innerHTML='<tr><th>Stof</th><th>Dichtheid (g/cm³)</th></tr>'; dichtheidTabelData.sort((a,b)=>a.stof.localeCompare(b.stof)).forEach(i=>{t.innerHTML+=`<tr><td>${i.stof}</td><td>${i.dichtheid}</td></tr>`;});}
    vulDichtheidTabel();

    init();
});
