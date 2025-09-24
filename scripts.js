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
        { type: 'mc', vraag: "Wat is de definitie van dichtheid?", opties: ["Hoe zwaar een stof is", "De massa per volume-eenheid", "Hoeveel ruimte een stof inneemt"], antwoord: "De massa per volume-eenheid" },
        { type: 'formula', vraag: "Vul de formule voor dichtheid correct in:", antwoord: "dichtheid=massa/volume" },
        { type: 'mc', vraag: "In welke eenheid wordt dichtheid vaak uitgedrukt in de natuurkunde?", opties: ["kg/L", "g/cm³", "mg/mL"], antwoord: "g/cm³" },
        { type: 'sort', vraag: "Zet het stappenplan voor een berekening in de juiste volgorde:", stappen: ["Gegevens noteren", "Formule noteren", "Formule invullen", "Antwoord en eenheid noteren"], antwoord: "gegevens noteren,formule noteren,formule invullen,antwoord en eenheid noteren" }
    ];
    
    const metingen = {
        set1: [
            { id: '1A', kleur: 'Paars', massa: 19.3, volume: 5.5, dichtheid: '3.51' }, { id: '1B', kleur: 'Blauw', massa: 0.4, volume: 1, dichtheid: '0.40' }, { id: '1C', kleur: 'Geel', massa: 19.32, volume: 1, dichtheid: '19.32' },
        ],
        set2: [
            { id: '2A', kleur: 'Lichtbruin', massa: 18, volume: 1.59, dichtheid: '11.32' }, { id: '2B', kleur: 'Donkerbruin', massa: 10.8, volume: 4, dichtheid: '2.70' }, { id: '2C', kleur: 'Groen', massa: 2.7, volume: 1, dichtheid: '2.70' },
        ],
        set3: [
            { id: '3A', kleur: 'Bordeaux', massa: 2.85, volume: 3, dichtheid: '0.95' }, { id: '3B', kleur: 'Grijs', massa: 6, volume: 6, dichtheid: '1.00' }, { id: '3C', kleur: 'Beige', massa: 23.4, volume: 3, dichtheid: '7.80' },
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
                volgendeBtn.style.display = 'none';
            }
        }
    });
    
    // --- VRAGEN GENERATOR VOOR SECTIE 1 ---
    function laadTheorieVragen() {
        const container = document.getElementById('theorie-vragen');
        container.innerHTML = '';
        theorieVragen.forEach((q, i) => {
            let html = `<div class="exercise" id="theorie-ex-${i}" data-answer="${q.antwoord}"><label>${i + 1}. ${q.vraag}</label>`;
            if (q.type === 'mc') {
                html += `<select id="q-theorie-${i}"><option value="">Kies een antwoord</option>`;
                q.opties.forEach(optie => html += `<option value="${optie}">${optie}</option>`);
                html += `</select>`;
            } else if (q.type === 'formula') {
                const parts = ["dichtheid", "massa", "volume"];
                const createSelect = () => {
                    let selectHtml = `<select><option value="">kies...</option>`;
                    parts.forEach(p => selectHtml += `<option value="${p}">${p}</option>`);
                    selectHtml += `</select>`;
                    return selectHtml;
                };
                html += `<div class="formula-container" id="q-theorie-${i}">${createSelect()} = ${createSelect()} / ${createSelect()}</div>`;
            } else if (q.type === 'sort') {
                let shuffled = [...q.stappen];
                const correctOrderString = q.stappen.join(',');
                while (shuffled.join(',') === correctOrderString) {
                    shuffled.sort(() => Math.random() - 0.5);
                }
                html += `<div class="drop-container" id="q-theorie-${i}">
                            <div class="source-list">
                                ${shuffled.map(stap => `<div class="draggable" draggable="true">${stap}</div>`).join('')}
                            </div>
                            <div class="target-list"></div>
                         </div>`;
            }
            html += `<div class="feedback"></div></div>`;
            container.innerHTML += html;
        });
        setupDragAndDrop();
    }
    
    // --- SLEEPVRAAG FUNCTIONALITEIT ---
    function setupDragAndDrop() {
        const draggables = document.querySelectorAll('.draggable');
        const containers = document.querySelectorAll('.source-list, .target-list');

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => draggable.classList.add('dragging'));
            draggable.addEventListener('dragend', () => draggable.classList.remove('dragging'));
        });

        containers.forEach(container => {
            container.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientY);
                const dragging = document.querySelector('.dragging');
                if (afterElement == null) {
                    container.appendChild(dragging);
                } else {
                    container.insertBefore(dragging, afterElement);
                }
                container.classList.add('over');
            });
             container.addEventListener('dragleave', () => container.classList.remove('over'));
             container.addEventListener('drop', () => container.classList.remove('over'));
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- VRAGEN GENEREREN (SECTIE 2 & 3) ---
    function laadSimulatieVragen(setNum) {
        const container = document.getElementById('simulatie-vragen');
        container.innerHTML = '';
        const setVragen = metingen[`set${setNum}`];
        setVragen.forEach((q, i) => {
            container.innerHTML += `
            <div class="exercise" data-answer="${q.dichtheid}">
                <label>${i + 1}. Je meet voor het ${q.kleur}e blok (ID: ${q.id}) een massa van ${q.massa} kg en een volume van ${q.volume} L. Bereken de dichtheid (g/cm³).</label>
                <input type="text" placeholder="Antwoord dichtheid">
                <div class="feedback"></div>
            </div>
            <div class="exercise" data-answer="${dichtheidTabelData.find(s => s.dichtheid == q.dichtheid)?.stof || 'Onbekend'}">
                <label>Welk materiaal is dit volgens de tabel?</label>
                <input type="text" placeholder="Antwoord materiaal">
                <div class="feedback"></div>
            </div>`;
        });
    }
    
    function laadControleVragen() {
        const container = document.getElementById('controle-vragen');
        container.innerHTML = ''; // Maak container leeg voor nieuwe vragen
        const alleMetingen = [...metingen.set1, ...metingen.set2, ...metingen.set3];
        const randomVragen = alleMetingen.sort(() => 0.5 - Math.random()).slice(0, 4); 
        randomVragen.forEach((q, i) => {
             container.innerHTML += `
             <div class="exercise" data-answer="${q.dichtheid}">
                <label>${i + 1}. Een object heeft een massa van ${q.massa} kg en een volume van ${q.volume} L. Wat is de dichtheid in g/cm³?</label>
                <input type="text" placeholder="Jouw antwoord">
                <div class="feedback"></div>
            </div>`;
        });
    }

    // --- CONTROLE LOGICA ---
    checkBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectie = e.target.dataset.section;
            const exercises = document.querySelectorAll(`#${sectie}-sectie .exercise`);
            
            exercises.forEach((ex) => {
                const feedback = ex.querySelector('.feedback');
                const correctAnswer = ex.dataset.answer.toLowerCase().trim();
                let userAnswer = '';
                
                if (ex.querySelector('.formula-container')) {
                    const selects = ex.querySelectorAll('select');
                    userAnswer = `${selects[0].value}=${selects[1].value}/${selects[2].value}`;
                } else if (ex.querySelector('.drop-container')) {
                    const items = ex.querySelectorAll('.target-list .draggable');
                    // GECOORIGEERDE REGEL: Zorgt voor correcte vergelijking
                    userAnswer = Array.from(items).map(item => item.textContent.toLowerCase()).join(',');
                } else {
                    const input = ex.querySelector('input, select');
                    if (input) userAnswer = input.value.toLowerCase().trim().replace(',', '.');
                }

                feedback.style.display = 'block';
                if (userAnswer === correctAnswer) {
                    feedback.textContent = `Correct! Het antwoord is inderdaad "${ex.dataset.answer}".`;
                    feedback.className = 'feedback correct';
                } else {
                    feedback.textContent = `Helaas, het juiste antwoord is "${ex.dataset.answer}".`;
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
        document.querySelector('.set-btn[data-set="1"]').classList.add('active');
        laadSimulatieVragen(1);
    }

    init();
});
