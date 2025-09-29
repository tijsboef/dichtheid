document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // 1. STATE MANAGEMENT & CONFIG
    // =================================================================================
    const APP_VERSION = "2.0"; // Verhoogd om localStorage te resetten
    let appState = {};
    const MAX_COMPLETIONS = 4;

    const defaultState = {
        appVersion: APP_VERSION,
        currentSectionIndex: 0,
        totalCompletions: 0,
        sections: [
            { id: 'theorie', title: 'Sectie 1: De Basis van Dichtheid', isComplete: false, attempts: 0, questions: [], errorLog: {} },
            { id: 'simulatie', title: 'Sectie 2: Oefenen met de Simulatie', isComplete: false, currentQuestionIndex: 0, questions: [] },
            { id: 'controle', title: 'Sectie 3: Controlevragen', isComplete: false, attempts: 0, questions: [], errorLog: {} }
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
            { id: 't1_v1', type: 'mc', prompt: "Wat beschrijft dichtheid het best?", options: ["De zwaarte van een object", "Massa per volume-eenheid", "De grootte van een object"], answer: "Massa per volume-eenheid", errorType: "definitie", hints: ["Denk aan de eenheid: g/cm³.", "Het is een verhouding.", "Dichtheid is massa gedeeld door..."] },
            { id: 't2_v1', type: 'formula', prompt: "Stel de formule voor dichtheid samen.", answer: "ρ=m/V", errorType: "formule", hints: ["ρ (rho) is het symbool voor dichtheid.", "Massa wordt gedeeld door volume.", "De formule is rho = m / V."] },
            { id: 't3_v1', type: 'sort', prompt: "Zet het stappenplan in de juiste volgorde.", items: ["Gegevens noteren", "Formule noteren", "Formule invullen", "Antwoord + eenheid"], answer: "Gegevens noteren,Formule noteren,Formule invullen,Antwoord + eenheid", errorType: "stappenplan", hints: ["Je begint altijd met inventariseren.", "De formule komt vóór het invullen.", "Het antwoord is de laatste stap."] }
        ],
        simulatie: {
            set1: [{id:'s1_1',set:1,type:'stappenplan',k:'paarse',m:'19.3',v:'5.5',d:'3.51',s:'Diamant'}, {id:'s1_2',set:1,type:'stappenplan',k:'blauwe',m:'0.4',v:'1',d:'0.40',s:'Hout'}, {id:'s1_3',set:1,type:'stappenplan',k:'gele',m:'19.32',v:'1',d:'19.32',s:'Goud'}, {id:'s1_4',set:1,type:'stappenplan',k:'rode',m:'5',v:'5',d:'1.00',s:'Water'}, {id:'s1_5',set:1,type:'stappenplan',k:'groene',m:'2.8',v:'7',d:'0.40',s:'Hout'}],
            set2: [{id:'s2_1',set:2,type:'stappenplan',k:'lichtbruine',m:'18',v:'1.59',d:'11.32',s:'Lood'}, {id:'s2_2',set:2,type:'stappenplan',k:'donkerbruine',m:'10.8',v:'4',d:'2.70',s:'Aluminium'}, {id:'s2_3',set:2,type:'stappenplan',k:'groene',m:'2.7',v:'1',d:'2.70',s:'Aluminium'}, {id:'s2_4',set:2,type:'stappenplan',k:'roze',m:'18',v:'4',d:'4.50',s:'Titanium'}, {id:'s2_5',set:2,type:'stappenplan',k:'lila',m:'44.8',v:'5',d:'8.96',s:'Koper'}],
            set3: [{id:'s3_1',set:3,type:'stappenplan',k:'bordeauxrode',m:'2.85',v:'3',d:'0.95',s:'Mens'}, {id:'s3_2',set:3,type:'stappenplan',k:'grijze',m:'6',v:'6',d:'1.00',s:'Water'}, {id:'s3_3',set:3,type:'stappenplan',k:'beige',m:'23.4',v:'3',d:'7.80',s:'Staal'}, {id:'s3_4',set:3,type:'stappenplan',k:'camel',m:'2',v:'5',d:'0.40',s:'Hout'}, {id:'s3_5',set:3,type:'stappenplan',k:'witte',m:'6',v:'6.32',d:'0.95',s:'Mens'}]
        },
        controle: [
            { id: 'c1_v1', type: 'stappenplan', prompt: "Een blokje heeft 270 g massa en 100 cm³ volume. Bereken de dichtheid.", data: {m:'270', v:'100'}, answer: '2.7', errorType: "berekening", hints: ["Formule: ρ = m / V.", "Deel 270 door 100.", "Het antwoord is 2,7 g/cm³."]},
            { id: 'c2_v1', type: 'stappenplan', prompt: "Een gouden ring heeft 2 cm³ volume. Bereken de massa. Zoek de dichtheid van goud op in de tabel.", data: {p:'19.32', v:'2'}, answer: '38.64', errorType: "formule_ombouwen", hints: ["Zoek eerst de dichtheid van goud.", "Formule: m = ρ * V.", "Vermenigvuldig 19,32 met 2."]},
            { id: 'c3_v1', type: 'stappenplan', prompt: "Een blokje van 780 g heeft 100 cm³ volume. Bereken de dichtheid en benoem het materiaal.", data: {m:'780', v:'100'}, answer: '7.8', stof: 'Staal', errorType: "tabel_aflezen", hints: ["Bereken eerst de dichtheid.", "Vergelijk je antwoord met de tabel.", "De dichtheid is 7,8 g/cm³, wat staal is."]}
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
        if (!appState.appVersion || appState.appVersion !== APP_VERSION || !appState.sections[0].questions || appState.sections[0].questions.length === 0) {
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
        appState.sections[1].questions = allSimQuestions.sort(() => 0.5 - Math.random()).slice(0, 5).map(q => ({...q, attempts: 0, isCorrect: false, isAnswered: false, errorLog: {}}));

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
                    const correctCount = section.questions.filter(q => q.isCorrect).length;
                    const total = section.questions.length || section.questionsTotal;
                    score = total > 0 ? (correctCount / total) * 100 : 0;
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
        nextBtn.style.display = 'none';
        prevBtn.style.display = appState.currentSectionIndex > 0 ? 'inline-block' : 'none';

        if (appState.currentSectionIndex === 1) {
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
        const errorMessages = {
            definitie: "de definities",
            formule: "het gebruik van de formule",
            stappenplan: "de volgorde van het stappenplan",
            berekening: "het maken van berekeningen",
            formule_ombouwen: "het ombouwen van de formule",
            tabel_aflezen: "het aflezen van de tabel"
        };

        appState.sections.forEach(sec => {
            const correctCount = sec.questions.filter(q => q.isCorrect).length;
            const total = sec.questions.length || sec.questionsTotal;
            const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
            
            let feedback = '';
            if (score < 100) {
                const errorCounts = {};
                sec.questions.filter(q => !q.isCorrect).forEach(q => {
                    const type = q.errorType || 'berekening';
                    errorCounts[type] = (errorCounts[type] || 0) + 1;
                });
                const topError = Object.keys(errorCounts).sort((a,b) => errorCounts[b] - errorCounts[a])[0];
                if(topError) feedback = `<div class="feedback-detail">💡 Tip: Oefen nog eens met ${errorMessages[topError]}.</div>`;
            }

            container.innerHTML += `<div class="resultaat-item ${score === 100 ? 'perfect' : ''}"><div><span>${sec.title}</span>${feedback}</div><span class="resultaat-percentage">${score}%</span></div>`;
        });
    }

    function checkAnswers() {
        const section = appState.sections[appState.currentSectionIndex];
        let allCorrect = true;

        const questionsContainer = document.getElementById(`${section.id}-vragen`);
        const exerciseElements = questionsContainer.querySelectorAll('.exercise');
        
        section.questions.forEach((q, index) => {
            const exEl = exerciseElements[index];
            const userAnswer = getUserAnswer(exEl, q.type);
            const isCorrect = checkAnswer(userAnswer, q);
            
            if(!isCorrect) allCorrect = false;
            q.isCorrect = isCorrect;
            
            displayFeedback(exEl, isCorrect, q);
        });
        
        section.attempts = (section.attempts || 0) + 1;
        if (allCorrect) section.isComplete = true;
        
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
        
        if (isFullyCorrect) {
            question.isCorrect = true;
            question.isAnswered = true;
            displayFeedback(exEl, true, question);
        } else {
            displayGranularFeedback(exEl, densityCorrect, stofCorrect, question);
            if (question.attempts >= 3) {
                question.isAnswered = true;
                const feedbackEl = exEl.querySelector('.feedback');
                feedbackEl.innerHTML += `<div class="hint">💡 Het juiste antwoord is <strong>${question.d} g/cm³</strong> voor de stof <strong>${question.s}</strong>. Klik op 'Volgende Vraag'.</div>`;
            }
        }

        if (section.questions.every(q => q.isAnswered)) {
            section.isComplete = true;
        }
    }

    function displayFeedback(el, isCorrect, qData) {
        const feedbackEl = el.querySelector('.feedback');
        qData.attempts++;
        
        if(isCorrect) {
            feedbackEl.innerHTML = `✅ Correct!`;
            feedbackEl.className = 'feedback correct';
            el.style.borderColor = 'var(--success-green)';
        } else {
            let hintHTML = '';
            if (qData.hints) {
                if (qData.attempts === 2) hintHTML = `<div class="hint">💡 Hint 1: ${qData.hints[0]}</div>`;
                if (qData.attempts === 3) hintHTML = `<div class="hint">💡 Hint 2: ${qData.hints[1]}</div>`;
                if (qData.attempts >= 4) hintHTML = `<div class="hint">💡 Antwoord: ${qData.hints[2]}</div>`;
            }
            feedbackEl.innerHTML = `❌ Probeer het nog eens. ${hintHTML}`;
            feedbackEl.className = 'feedback incorrect';
        }
        feedbackEl.style.display = 'block';
    }

    function displayGranularFeedback(el, densityCorrect, stofCorrect, qData) {
        const feedbackEl = el.querySelector('.feedback');
        let feedbackHTML = '';
        if (densityCorrect) feedbackHTML += `✅ Je berekening van de dichtheid is correct!<br>`;
        else feedbackHTML += `❌ De berekende dichtheid klopt niet. `;
        if (stofCorrect) feedbackHTML += `✅ De naam van de stof is correct!`;
        else feedbackHTML += `❌ De naam van de stof klopt niet.`;
        if (qData.attempts >= 2) feedbackHTML += `<div class="hint">💡 Hint: Controleer je meting en vergelijk de berekende dichtheid goed met de tabel.</div>`
        feedbackEl.innerHTML = feedbackHTML;
        feedbackEl.className = 'feedback incorrect';
        feedbackEl.style.display = 'block';
    }

    function getUserAnswer(exerciseEl, type) {
        if (type === 'mc') return exerciseEl.querySelector('select')?.value || "";
        if (type === 'formula') { const s = exerciseEl.querySelectorAll('select'); return `${s[0].value}=${s[1].value}/${s[2].value}`; }
        if (type === 'sort') return Array.from(exerciseEl.querySelectorAll('.sort-list .draggable')).map(d => d.textContent.trim()).join(',');
        if (type === 'stappenplan') {
            const antwoord = exerciseEl.querySelector('.antwoord-input')?.value.trim();
            const stof = exerciseEl.querySelector('.stof-input')?.value.trim();
            return { antwoord, stof };
        }
        return '';
    }

    function checkAnswer(userAnswer, questionData) {
        if (questionData.type === 'stappenplan') {
            const densityCorrect = compareNumericAnswers(userAnswer.antwoord, questionData.d || questionData.answer);
            const stofCorrect = !questionData.s && !questionData.stof || userAnswer.stof.toLowerCase() === (questionData.s || questionData.stof).toLowerCase();
            return { densityCorrect, stofCorrect, isFullyCorrect: densityCorrect && stofCorrect };
        } else {
            return userAnswer.toLowerCase().replace(/\s/g, '') === questionData.answer.toLowerCase().replace(/\s/g, '');
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
            const q = section.questions[section.currentQuestionIndex];
            container.innerHTML += generateQuestionHTML(q);
        } else {
            section.questions.forEach(q => container.innerHTML += generateQuestionHTML(q));
        }
        setupDragAndDrop();
    }
    function generateQuestionHTML(q) {
        let content = '';
        if (q.type === 'mc') { content = `<select><option value="">Kies...</option>${q.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select>`;
        } else if (q.type === 'formula') { const p = ['ρ', 'm', 'V']; const cS=()=>`<select><option value="">?</option>${p.map(i => `<option value="${i}">${i}</option>`).join('')}</select>`; content = `<div class="formula-wrapper"><div class="formula-part">${cS()}</div><span class="equals">=</span><div class="formula-fraction"><div class="numerator">${cS()}</div><div class="denominator">${cS()}</div></div></div>`;
        } else if (q.type === 'sort') { let s = [...q.items]; while (s.join(',') === q.answer) { s.sort(() => 0.5 - Math.random()); } content = `<div class="sort-container"><div class="step-labels"><div>Stap 1</div><div>Stap 2</div><div>Stap 3</div><div>Stap 4</div></div><div class="sort-list">${s.map(i => `<div class="draggable" draggable="true">${i}</div>`).join('')}</div></div>`;
        } else { const stofInput = q.s || q.stof ? `<hr><div class="stap-rij"><label>De stof is:</label><input class="stof-input" type="text" placeholder="Naam materiaal"></div>` : ''; content = `<div class="stappenplan-container"><div class="stap-rij"><label>Stap 1:</label>${createDropdown(grootheden)}<span>=</span><input type="text" placeholder="waarde">${createDropdown(eenheden)}</div><div class="stap-rij"><label></label>${createDropdown(grootheden)}<span>=</span><input type="text" placeholder="waarde">${createDropdown(eenheden)}</div><div class="stap-rij"><label>Stap 2:</label>${createDropdown(grootheden)}<span>=</span>${createDropdown(grootheden)}${createDropdown(operatoren)}${createDropdown(grootheden)}</div><div class="stap-rij"><label>Stap 3:</label>${createDropdown(grootheden)}<span>=</span><input type="text" placeholder="waarde">${createDropdown(operatoren)}<input type="text" placeholder="waarde"></div><div class="stap-rij"><label>Stap 4:</label>${createDropdown(grootheden)}<span>=</span><input class="antwoord-input" type="text" placeholder="antwoord">${createDropdown(eenheden)}</div>${stofInput}</div>`; }
        let prompt = q.prompt || `Bereken de dichtheid van het ${q.k}e blok (${q.id}).`;
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
    function setupDragAndDrop() {
        const draggables = document.querySelectorAll('.draggable');
        const sortList = document.querySelector('.sort-list');
        if (!sortList) return;

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => draggable.classList.add('dragging'));
            draggable.addEventListener('dragend', () => draggable.classList.remove('dragging'));
        });

        sortList.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(sortList, e.clientY);
            const dragging = document.querySelector('.dragging');
            if (afterElement == null) {
                sortList.appendChild(dragging);
            } else {
                sortList.insertBefore(dragging, afterElement);
            }
        });
    }
    function getDragAfterElement(container,y){const d=[...container.querySelectorAll('.draggable:not(.dragging)')];return d.reduce((cl,ch)=>{const b=ch.getBoundingClientRect(),o=y-b.top-b.height/2;if(o<0&&o>cl.offset){return{offset:o,element:ch};}else{return cl;}},{offset:Number.NEGATIVE_INFINITY}).element;}
    
    checkBtn.addEventListener('click', checkAnswers);
    nextBtn.addEventListener('click', () => {
        const section = appState.sections[appState.currentSectionIndex];
        if (section.id === 'simulatie') {
            if (section.currentQuestionIndex < section.questions.length - 1) {
                section.currentQuestionIndex++;
                renderCurrentSection();
            } else {
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
    function vulDichtheidTabel() { const t=document.getElementById('dichtheid-tabel'); t.innerHTML='<tr><th>Stof</th><th>Dichtheid (g/cm³)</th></tr>'; dichtheidTabelData.sort((a,b)=>parseFloat(a.dichtheid)-parseFloat(b.dichtheid)).forEach(i=>{t.innerHTML+=`<tr><td>${i.stof}</td><td>${i.dichtheid}</td></tr>`;});}
    vulDichtheidTabel();

    init();
});
