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
    let currentBlanksCount = 0;

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            words = text.split('\n').map(line => {
                const [word, comment] = line.split(',');
                return { word, comment };
            });
            shuffleArray(words); // Shuffle the words array
            showNextWord();
        };
        reader.readAsText(file);
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBlanks(word) {
       Count = (word.match(/ij/g) || []).length + (word.match(/ei/g) || []).length;
        return word.replace(/ij/g, '__').replace(/ei/g, '__');
    }

    function showNextWord() {
        if (words.length === 0 && incorrectWords.length === 0) {
            endGame();
            return;
        }
        if (words.length === 0 && incorrectWords.length > 0) {
            words = incorrectWords;
            incorrectWords = [];
        }
        const wordData = words[Math.floor(Math.random() * words.length)];
        currentWord = wordData.word;
        currentBlanks = createBlanks(currentWord);
        gameContainer.innerHTML = `<p>${currentBlanks}</p><p>${wordData.comment}</p>`;
    }

    function checkAnswer(answer) {
        const blanksCount = (currentBlanks.match(/__/g) || []).length;
        if (blanksCount > 0) {
            currentBlanks = currentBlanks.replace('__', answer);
            gameContainer.innerHTML = `<p>${currentBlanks}</p>`;
            if (currentBlanks === currentWord) {
                correctAnswers++;
                streakLength++;
                setTimeout(() => {
                    words = words.filter(wordData => wordData.word !== currentWord);
                    showNextWord();
                }, 1500);
            } else {
                currentBlanksCount--;
            }
        } else {
            incorrectAnswers++;
            streakLength = 0;
            if (!incorrectWords.includes(currentWord)) {
                incorrectWords.push(currentWord);
            }
            gameContainer.innerHTML += `<p style="color: red;">Incorrect answer!</p>`;
            setTimeout(() => {
                showNextWord();
            }, 1500);
        }
    }

    ijButton.addEventListener('click', () => checkAnswer('ij'));
    eiButton.addEventListener('click', () => checkAnswer('ei'));

    function endGame() {
        alert(`Game Over!\nCorrect Answers: ${correctAnswers}\nIncorrect Answers: ${incorrectAnswers}\nStreak Length: ${streakLength}\nIncorrect Words: ${incorrectWords.join(', ')}`);
    }
});
