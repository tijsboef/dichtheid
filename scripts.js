document.addEventListener('DOMContentLoaded', () => {
    const exerciseSetContainer = document.getElementById('exercise-set');
    const checkAnswersButton = document.getElementById('check-answers');
    const newSetButton = document.getElementById('new-set');

    const allExercises = [
        {
            question: "Een blokje heeft een massa van 270 g en een volume van 100 cm³. Wat is de dichtheid van het blokje in g/cm³?",
            answer: "2.7",
            unit: "g/cm³"
        },
        {
            question: "Een voorwerp met een dichtheid van 0.8 g/cm³ wordt in water (dichtheid 1.0 g/cm³) geplaatst. Wat gebeurt er met het voorwerp?",
            answer: "drijft",
            unit: ""
        },
        {
            question: "1.5 L benzine heeft een massa van 1080 g. Bereken de dichtheid van benzine in g/L.",
            answer: "720",
            unit: "g/L"
        },
        {
            question: "Een gouden ring (dichtheid 19.3 g/cm³) heeft een volume van 2 cm³. Wat is de massa van de ring?",
            answer: "38.6",
            unit: "g"
        },
        {
            question: "Je hebt een blokje van 500 g met een dichtheid van 2.5 g/cm³. Wat is het volume van het blokje?",
            answer: "200",
            unit: "cm³"
        },
        {
            question: "0.5 liter alcohol (dichtheid 0.80 g/cm³) heeft een massa van ... gram.",
            answer: "400",
            unit: "g"
        },
        {
            question: "Een object heeft een volume van 150 cm³ en een massa van 1695 g. Van welk materiaal zou dit object gemaakt kunnen zijn (kijk in tabel 1 uit het document)?",
            answer: "lood",
            unit: ""
        },
        {
            question: "Bereken het volume van 1 kg staal (dichtheid 7.8 g/cm³). Rond af op twee decimalen.",
            answer: "128.21",
            unit: "cm³"
        }
    ];

    let currentExercises = [];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function generateExerciseSet() {
        exerciseSetContainer.innerHTML = '';
        currentExercises = shuffle([...allExercises]).slice(0, 4);
        
        currentExercises.forEach((exercise, index) => {
            const exerciseElement = document.createElement('div');
            exerciseElement.classList.add('exercise');
            exerciseElement.innerHTML = `
                <label for="q${index}">${index + 1}. ${exercise.question}</label>
                <input type="text" id="q${index}" placeholder="Antwoord">
                <div class="feedback"></div>
            `;
            exerciseSetContainer.appendChild(exerciseElement);
        });
    }

    function checkAnswers() {
        currentExercises.forEach((exercise, index) => {
            const input = document.getElementById(`q${index}`);
            const feedback = input.nextElementSibling;
            
            const userAnswer = input.value.trim().toLowerCase().replace(',', '.');
            const correctAnswer = exercise.answer.toLowerCase();

            feedback.style.display = 'block';

            if (userAnswer === correctAnswer) {
                feedback.textContent = `Correct! Het antwoord is ${exercise.answer} ${exercise.unit}.`;
                feedback.className = 'feedback correct';
            } else {
                feedback.textContent = `Helaas, het juiste antwoord is ${exercise.answer} ${exercise.unit}.`;
                feedback.className = 'feedback incorrect';
            }
        });
    }

    checkAnswersButton.addEventListener('click', checkAnswers);
    newSetButton.addEventListener('click', generateExerciseSet);

    // Initial load
    generateExerciseSet();
});
