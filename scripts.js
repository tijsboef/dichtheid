document.addEventListener('DOMContentLoaded', () => {
    const exerciseSetContainer = document.getElementById('exercise-set');
    const checkAnswersButton = document.getElementById('check-answers');
    const newSetButton = document.getElementById('new-set');

    // Nieuwe vragen gebaseerd op jouw metingen
    const allExercises = [
        // Set 1
        {
            question: "Een paars blok (1A) heeft een massa van 19,3 kg en een volume van 5,5 L. Wat is de dichtheid in g/cm³? (Rond af op twee decimalen)",
            answer: "3.51",
            unit: "g/cm³"
        },
        {
            question: "Een blauw blok (1B) heeft een massa van 0,4 kg en een volume van 1 L. Wat is de dichtheid in g/cm³?",
            answer: "0.4",
            unit: "g/cm³"
        },
        {
            question: "Een geel blok (1C) heeft een massa van 19,32 kg en een volume van 1 L. Wat is de dichtheid in g/cm³?",
            answer: "19.32",
            unit: "g/cm³"
        },
        {
            question: "Een rood blok (1D) heeft een massa van 5 kg en een volume van 5 L. Wat is de dichtheid in g/cm³?",
            answer: "1.0",
            unit: "g/cm³"
        },
        {
            question: "Een groen blok (1E) heeft een massa van 2,8 kg en een volume van 7 L. Wat is de dichtheid in g/cm³?",
            answer: "0.4",
            unit: "g/cm³"
        },
        // Set 2
        {
            question: "Een lichtbruin blok (2A) heeft een massa van 18 kg en een volume van 1,59 L. Wat is de dichtheid in g/cm³? (Rond af op twee decimalen)",
            answer: "11.32",
            unit: "g/cm³"
        },
        {
            question: "Een donkerbruin blok (2B) heeft een massa van 10,8 kg en een volume van 4 L. Wat is de dichtheid in g/cm³?",
            answer: "2.7",
            unit: "g/cm³"
        },
        {
            question: "Een groen blok (2C) heeft een massa van 2,7 kg en een volume van 1 L. Wat is de dichtheid in g/cm³?",
            answer: "2.7",
            unit: "g/cm³"
        },
        {
            question: "Een roze blok (2D) heeft een massa van 18 kg en een volume van 4 L. Wat is de dichtheid in g/cm³?",
            answer: "4.5",
            unit: "g/cm³"
        },
        {
            question: "Een lila blok (2E) heeft een massa van 44,8 kg en een volume van 5 L. Wat is de dichtheid in g/cm³? (Rond af op twee decimalen)",
            answer: "8.96",
            unit: "g/cm³"
        },
        // Set 3
        {
            question: "Een bordeaux blok (3A) heeft een massa van 2,85 kg en een volume van 3 L. Wat is de dichtheid in g/cm³?",
            answer: "0.95",
            unit: "g/cm³"
        },
        {
            question: "Een grijs blok (3B) heeft een massa van 6 kg en een volume van 6 L. Wat is de dichtheid in g/cm³?",
            answer: "1.0",
            unit: "g/cm³"
        },
        {
            question: "Een beige blok (3C) heeft een massa van 23,4 kg en een volume van 3 L. Wat is de dichtheid in g/cm³?",
            answer: "7.8",
            unit: "g/cm³"
        },
        {
            question: "Een camel blok (3D) heeft een massa van 2 kg en een volume van 5 L. Wat is de dichtheid in g/cm³?",
            answer: "0.4",
            unit: "g/cm³"
        },
        {
            question: "Een wit blok (3E) heeft een massa van 6 kg en een volume van 6,32 L. Wat is de dichtheid in g/cm³? (Rond af op twee decimalen)",
            answer: "0.95",
            unit: "g/cm³"
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
            exerciseElement.innerHTML = \`
                <label for="q\${index}">\${index + 1}. \${exercise.question}</label>
                <input type="text" id="q\${index}" placeholder="Antwoord">
                <div class="feedback"></div>
            \`;
            exerciseSetContainer.appendChild(exerciseElement);
        });
    }

    function checkAnswers() {
        currentExercises.forEach((exercise, index) => {
            const input = document.getElementById(\`q\${index}\`);
            const feedback = input.nextElementSibling;
            
            const userAnswer = input.value.trim().toLowerCase().replace(',', '.');
            const correctAnswer = exercise.answer.toLowerCase();

            feedback.style.display = 'block';

            if (userAnswer === correctAnswer) {
                feedback.textContent = \`Correct! Het antwoord is \${exercise.answer} \${exercise.unit}.\`;
                feedback.className = 'feedback correct';
            } else {
                feedback.textContent = \`Helaas, het juiste antwoord is \${exercise.answer} \${exercise.unit}.\`;
                feedback.className = 'feedback incorrect';
            }
        });
    }

    checkAnswersButton.addEventListener('click', checkAnswers);
    newSetButton.addEventListener('click', generateExerciseSet);

    // Initial load
    generateExerciseSet();
});
