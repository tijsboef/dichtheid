document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIG & STATE MANAGEMENT ---
    const appState = {
        currentSectionIndex: 0,
        totalCompletions: 0,
        sections: [
            { id: 'theorie', isComplete: false, attempts: 0, questions: [] },
            { id: 'simulatie', isComplete: false, attempts: 0, questions: [] },
            { id: 'controle', isComplete: false, attempts: 0, questions: [] }
        ],
        activeQuestions: {
            theorie: [],
            simulatie: [],
            controle: []
        }
    };

    function saveState() {
        localStorage.setItem('dichtheidAppState', JSON.stringify(appState));
    }

    function loadState() {
        const savedState = localStorage.getItem('dichtheidAppState');
        if (savedState) {
            Object.assign(appState, JSON.parse(savedState));
        }
    }

    // --- DATA ---
    const dichtheidTabelData = [ { stof: "Hout", dichtheid: "0.40" }, { stof: "Benzine", dichtheid: "0.72" }, { stof: "IJs", dichtheid: "0.92" }, { stof: "Water", dichtheid: "1.00" }, { stof: "Aluminium", dichtheid: "2.70" }, { stof: "Staal", dichtheid: "7.80" }, { stof: "Koper", dichtheid: "8.96" }, { stof: "Lood", dichtheid: "11.32" }, { stof: "Goud", dichtheid: "19.32" } ];
    const grootheden = ['ρ', 'm', 'V'], eenheden = ['g', 'kg', 'cm³', 'L', 'g/cm³', 'kg/L'], operatoren = ['/', '*', '+', '-'];

    // --- VRAGEN DATABASE ---
    // (Vragen zijn nu functies die een object retourneren om telkens een unieke instantie te krijgen)
    const questionDB = {
        theorie: [
            () => ({ id: 't1', type: 'mc', prompt: "Wat beschrijft dichtheid het best?", options: ["De zwaarte van een object", "Massa per volume-eenheid", "De grootte van een object"], answer: "Massa per volume-eenheid", hints: ["Denk aan de formule.", "Het gaat om de verhouding tussen twee grootheden.", "Dichtheid is massa gedeeld door..."] }),
            () => ({ id: 't2', type: 'formula', prompt: "Stel de formule voor dichtheid samen.", answer: "ρ=m/V", hints: ["ρ is het symbool voor dichtheid.", "Massa wordt gedeeld door volume.", "De formule is rho = m / V."] }),
            () => ({ id: 't3', type: 'sort', prompt: "Zet het stappenplan in de juiste volgorde.", items: ["Gegevens noteren", "Formule noteren", "Formule invullen", "Antwoord + eenheid"], answer: "Gegevens noteren,Formule noteren,Formule invullen,Antwoord + eenheid", hints: ["Je begint altijd met inventariseren.", "De formule komt vóór het invullen.", "Het antwoord is de allerlaatste stap."] })
        ],
        simulatie: [
            // Vragen per blok
        ],
        controle: [
            () => ({ id: 'c1', type: 'stappenplan', prompt: "Een blokje heeft een massa van 540 g en een volume van 200 cm³. Bereken de dichtheid.", data: {m:'540', v:'200'}, answer: '2.7', hints: ["Gebruik ρ = m / V.", "Deel 540 door 200.", "Het antwoord is 2,7 g/cm³."]}),
            () => ({ id: 'c2', type: 'stappenplan', prompt: "Een stalen balk heeft een volume van 50 cm³. Bereken de massa. Zoek de dichtheid op in de tabel.", data: {v:'50', p:'7.80'}, answer: '390', hints: ["Zoek eerst de dichtheid van staal op.", "Formule: m = ρ * V.", "Vermenigvuldig 7,80 met 50."]}),
            () => ({ id: 'c3', type: 'stappenplan', prompt: "Een object van 400 g heeft een dichtheid van 0.40 g/cm³. Bereken het volume en benoem het materiaal.", data: {m:'400', p:'0.40'}, answer: '1000', stof: 'Hout', hints: ["Formule: V = m / ρ.", "Deel 400 door 0.40.", "Een volume van 1000 cm³ en de stof is hout."]}),
        ]
    };

    const simBlocks = {
        set1: [ { kleur: 'Paars', massa: '19.3', volume: '5.5', dichtheid: '3.51' }, { kleur: 'Blauw', massa: '0.4', volume: '1', dichtheid: '0.40' }, /* ... de rest ... */ ],
        // ... set2, set3
    };

    // --- UI ELEMENTEN ---
    const mainTitle = document.getElementById('main-title');
    const contentSections = document.querySelectorAll('.content-sectie');
    const navButtons = document.querySelectorAll('.nav-btn');
    const checkBtn = document.getElementById('check-answers-btn');
    const nextBtn = document.getElementById('volgende-sectie-btn');
    const prevBtn = document.getElementById('vorige-sectie-btn');

    // --- APP LOGICA ---
    
    function init() {
        loadState();
        if (appState.totalCompletions >= 4) {
            localStorage.removeItem('dichtheidAppState');
            window.location.reload();
        }
        setupQuestions();
        renderCurrentSection();
        updateUI();
    }

    function setupQuestions() {
        // Selecteer willekeurige vragen voor deze sessie
        appState.activeQuestions.theorie = selectRandomQuestions(questionDB.theorie, 3);
        // ... doe hetzelfde voor simulatie en controle
    }
    
    function selectRandomQuestions(questionArray, count) {
        // Implementeer logica om 'count' unieke vragen te kiezen
        return questionArray.map(qFunc => qFunc()); // Roep functie aan om object te krijgen
    }

    function renderCurrentSection() {
        const sectionId = appState.sections[appState.currentSectionIndex].id;
        const container = document.getElementById(`${sectionId}-vragen`);
        container.innerHTML = '';
        appState.activeQuestions[sectionId].forEach(q => {
            container.innerHTML += generateQuestionHTML(q);
        });
        // Event listeners voor drag-drop etc. hier opnieuw toevoegen
    }

    function generateQuestionHTML(q) {
        // Genereer de HTML voor een vraag, inclusief varianten
        let html = `<div class="exercise" data-question-id="${q.id}" data-attempts="0"><h3>${q.prompt}</h3>`;
        // ... bouw HTML voor mc, sort, stappenplan etc.
        html += `<div class="feedback"></div></div>`;
        return html;
    }

    function checkAnswers() {
        const sectionId = appState.sections[appState.currentSectionIndex].id;
        let allCorrect = true;

        appState.activeQuestions[sectionId].forEach(q => {
            const exerciseEl = document.querySelector(`.exercise[data-question-id="${q.id}"]`);
            // ... logica om user antwoord te lezen
            const userAnswer = "..."; 
            
            if (userAnswer.toLowerCase() === q.answer.toLowerCase()) {
                // ... toon correct feedback
            } else {
                allCorrect = false;
                let attempts = parseInt(exerciseEl.dataset.attempts) + 1;
                exerciseEl.dataset.attempts = attempts;
                // ... toon incorrect feedback + hint logic
            }
        });

        if (allCorrect) {
            appState.sections[appState.currentSectionIndex].isComplete = true;
            nextBtn.style.display = 'block';
            checkBtn.style.display = 'none';
        }
        saveState();
        updateUI();
    }
    
    function updateUI() {
        // Update titels, knoppen, progress bars etc. gebaseerd op appState
    }

    // --- EVENT LISTENERS ---
    checkBtn.addEventListener('click', checkAnswers);
    // ... andere listeners
    
    init();
});
