document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const dichtheidTabelData = [
        { stof: "Hout", dichtheid: "0.40" }, { stof: "Benzine", dichtheid: "0.68" },
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
        { type: 'mc', vraag: "Wat is de definitie van dichtheid?", opties: ["Hoe zwaar iets is", "Hoe groot iets is", "De massa per volume-eenheid"], antwoord: "De massa per volume-eenheid" },
        { type: 'open', vraag: "Wat is de formule voor dichtheid?", antwoord: "dichtheid = massa / volume" },
        { type: 'open', vraag: "In welke eenheid wordt dichtheid vaak uitgedrukt?", antwoord: "g/cm³" },
        { type: 'sort', vraag: "Zet het stappenplan voor een berekening in de juiste volgorde:", stappen: ["Formule invullen", "Gegevens noteren", "Antwoord en eenheid noteren", "Formule noteren"], antwoord: ["Gegevens noteren", "Formule noteren", "Formule invullen", "Antwoord en eenheid noteren"] }
    ];
    
    // Jouw metingen voor simulatie- en controlevragen
    const metingen = {
        set1: [
            { id: '1A', kleur: 'Paars', massa: 19.3, volume: 5.5, dichtheid: '3.51' },
            { id: '1B', kleur: 'Blauw', massa: 0.4, volume: 1, dichtheid: '0.40' },
            { id: '1C', kleur: 'Geel', massa: 19.32, volume: 1, dichtheid: '19.32' },
        ],
        set2: [
            { id: '2A', kleur: 'Lichtbruin', massa: 18, volume: 1.59, dichtheid: '11.32' },
            { id: '2B', kleur: 'Donkerbruin', massa: 10.8, volume: 4, dichtheid: '2.70' },
            { id: '2C', kleur: 'Groen', massa: 2.7, volume: 1, dichtheid: '2.70' },
        ],
        set3: [
            { id: '3A', kleur: 'Bordeaux', massa: 2.85, volume: 3, dichtheid: '0.95' },
            { id: '3B', kleur: 'Grijs', massa: 6, volume: 6, dichtheid: '1.00' },
            { id: '3C', kleur: 'Beige', massa: 23.4, volume: 3, dichtheid: '7.80' },
        ]
    };
    
    // --- ELEMENTEN ---
    const secties = document.querySelectorAll('.content-sectie');
    const volgendeBtn = document.getElementById('volgende-sectie-btn');
    const checkBtns = document.querySelectorAll('.check-answers');
    let huidigeSectieIndex = 0;

    // --- MODAL LOGICA ---
    const modal = document.getElementById('dichtheid-modal');
    document.getElementById('toggle-table-btn').onclick = () => modal.style.display = "block";
    document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

    function vulDichtheidTabel() {
        const tabel = document.getElementById('dichtheid-tabel');
        tabel.innerHTML = '<tr><th>Materiaal</th><th>Dichtheid (kg/L of g/cm³)</th></tr>';
        dichtheidTabelData.sort((a, b) => a.stof.localeCompare(b.stof)).forEach(item => {
            tabel.innerHTML += `<tr><td>${item.stof}</td><td>${item.dichtheid}</td></tr>`;
        });
    }

    // --- SECTIE NAVIGATIE ---
    volgendeBtn.addEventListener('click', () => {
        if (huidigeSectieIndex < secties.length - 1) {
            secties[huidigeSectieIndex].style.display = 'none';
            huidigeSectieIndex++;
            secties[huidigeSectieIndex].style.display = 'block';
            if (huidigeSectieIndex === secties.length - 1) {
                volgendeBtn.style.display = 'none'; // Verberg knop op laatste sectie
            }
        }
    });
    
    // --- VRAGEN GENEREREN ---
    function laadTheorieVragen() {
        const container = document.getElementById('theorie-vragen');
        theorieVragen.forEach((q, i) => {
            let html = `<div class="exercise" data-answer="${q.antwoord}"><label>${i + 1}. ${q.vraag}</label>`;
            if (q.type === 'mc') {
                html += `<select id="q-theorie-${i}"><option value="">Kies een antwoord</option>`;
                q.opties.forEach(optie => html += `<option value="${optie}">${optie}</option>`);
                html += `</select>`;
            } else if (q.type === 'open') {
                 html += `<input type="text" id="q-theorie-${i}" placeholder="Jouw antwoord">`;
            } // Sleepvraag is complex, voor nu een open vraag als alternatief
            html += `<div class="feedback"></div></div>`;
            container.innerHTML += html;
        });
    }

    function laadSimulatieVragen(setNum) {
        const container = document.getElementById('simulatie-vragen');
        container.innerHTML = ''; // Leegmaken voor nieuwe set
        const setVragen = metingen[`set${setNum}`];
        setVragen.forEach((q, i) => {
            container.innerHTML += `
            <div class="exercise" data-answer="${q.dichtheid}">
                <label>${i + 1}. Je meet voor het ${q.kleur}e blok (ID: ${q.id}) een massa van ${q.massa} kg en een volume van ${q.volume} L. Bereken de dichtheid (g/cm³).</label>
                <input type="text" id="q-sim-${setNum}-${i}" placeholder="Antwoord dichtheid">
                <div class="feedback"></div>
            </div>
            <div class="exercise" data-answer="${dichtheidTabelData.find(s => s.dichtheid == q.dichtheid)?.stof || 'Onbekend'}">
                <label>Welk materiaal is dit volgens de tabel?</label>
                <input type="text" id="q-sim-mat-${setNum}-${i}" placeholder="Antwoord materiaal">
                <div class="feedback"></div>
            </div>`;
        });
    }
    
    function laadControleVragen() {
        const container = document.getElementById('controle-vragen');
        const alleMetingen = [...metingen.set1, ...metingen.set2, ...metingen.set3];
        // Pak 4 willekeurige vragen
        const randomVragen = alleMetingen.sort(() => 0.5 - Math.random()).slice(0, 4); 
        randomVragen.forEach((q, i) => {
             container.innerHTML += `
             <div class="exercise" data-answer="${q.dichtheid}">
                <label>${i + 1}. Een object heeft een massa van ${q.massa} kg en een volume van ${q.volume} L. Wat is de dichtheid in g/cm³?</label>
                <input type="text" id="q-controle-${i}" placeholder="Jouw antwoord">
                <div class="feedback"></div>
            </div>`;
        });
    }

    // --- ANTWOORDEN CONTROLEREN ---
    checkBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectie = e.target.dataset.section;
            const vragen = document.querySelectorAll(`#${sectie}-sectie .exercise`);
            vragen.forEach(vraag => {
                const input = vraag.querySelector('input, select');
                const feedback = vraag.querySelector('.feedback');
                const correctAnswer = vraag.dataset.answer.toLowerCase().trim();
                const userAnswer = input.value.toLowerCase().trim().replace(',', '.');
                
                feedback.style.display = 'block';
                if (userAnswer === correctAnswer) {
                    feedback.textContent = `Correct! Het antwoord is inderdaad ${vraag.dataset.answer}.`;
                    feedback.className = 'feedback correct';
                } else {
                    feedback.textContent = `Helaas, het juiste antwoord is "${vraag.dataset.answer}".`;
                    feedback.className = 'feedback incorrect';
                }
            });
        });
    });

    // --- SIMULATIE SET KIEZEN ---
    document.querySelectorAll('.set-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.set-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            laadSimulatieVragen(e.target.dataset.set);
        });
    });
    
    // --- INITIALISATIE ---
    function init() {
        vulDichtheidTabel();
        laadTheorieVragen();
        laadControleVragen();
        // Start met het laden van set 1 in de simulatie sectie
        document.querySelector('.set-btn[data-set="1"]').classList.add('active');
        laadSimulatieVragen(1);
    }

    init();
});
