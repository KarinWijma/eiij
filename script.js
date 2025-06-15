document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const gameContainer = document.getElementById('game-container');
    const ijButton = document.getElementById('ijButton');
    const eiButton = document.getElementById('eiButton');
    let words = [];
    let currentWord = '';
    let currentBlanks = '';
    let incorrectWords = [];
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let streakLength = 0;

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            words = text.split('\n').map(line => {
                const [word, comment] = line.split(',');
                return { word, comment };
            });
            showNextWord();
        };
        reader.readAsText(file);
    });

    function createBlanks(word) {
        return word.replace(/ij/g, '__').replace(/ei/g, '__');
    }

    function showNextWord() {
        if (words.length === 0) {
            endGame();
            return;
        }
        const wordData = words[Math.floor(Math.random() * words.length)];
        currentWord = wordData.word;
        currentBlanks = createBlanks(currentWord);
        gameContainer.innerHTML = `<p>${currentBlanks}</p><p>${wordData.comment}</p>`;
    }

    function checkAnswer(answer) {
        const originalWord = currentWord.replace('__', answer);
        if (originalWord === currentWord) {
            correctAnswers++;
            streakLength++;
            gameContainer.innerHTML = `<p>${currentWord}</p>`;
            setTimeout(() => {
                words = words.filter(wordData => wordData.word !== currentWord);
                showNextWord();
            }, 1500);
        } else {
            incorrectAnswers++;
            streakLength = 0;
            if (!incorrectWords.includes(currentWord)) {
                incorrectWords.push(currentWord);
            }
            showNextWord();
        }
    }

    ijButton.addEventListener('click', () => checkAnswer('ij'));
    eiButton.addEventListener('click', () => checkAnswer('ei'));

    function endGame() {
        alert(`Game Over!\nCorrect Answers: ${correctAnswers}\nIncorrect Answers: ${incorrectAnswers}\nStreak Length: ${streakLength}\nIncorrect Words: ${incorrectWords.join(', ')}`);
    }
});
