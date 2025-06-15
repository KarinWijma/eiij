<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IJ/EI Spel</title>
</head>
<body>
    <input type="file" id="fileInput">
    <div id="game-container"></div>
    <button id="ijButton">IJ</button>
    <button id="eiButton">EI</button>

    <script>
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
            let questionQueue = [];
            let recentQuestions = [];

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
                currentBlanksCount = (word.match(/ij/g) || []).length + (word.match(/ei/g) || []).length;
                return word.replace(/ij/g, '__').replace(/ei/g, '__');
            }

            function showNextWord() {
                if (words;
                }
                if (words.length === 0 && questionQueue.length > 0) {
                    words.push(...questionQueue.splice(0, questionQueue.length));
                }
                let wordData;
                do {
                    wordData = words.shift();
                } while (recentQuestions.includes(wordData.word) && words.length > 0);

                recentQuestions.push(wordData.word);
                if (recentQuestions.length > 2) {
                    recentQuestions.shift();
                }

                currentWord = wordData.word;
                currentBlanks = createBlanks(currentWord);
                gameContainer.innerHTML = `<p>${currentBlanks}</p><p>${wordData.comment}</p>`;
            }

            function checkAnswer(answer) {
                const blanksCount = (currentBlanks.match(/__/g) || []).length;
                if (blanksCount > 0) {
                    const newBlanks = currentBlanks.replace('__', answer);
                    if (newBlanks === currentWord) {
                        correctAnswers++;
                        streakLength++;
                        currentBlanks = newBlanks;
                        gameContainer.innerHTML = `<p>${currentBlanks}</p><p style="color: green;">Correct answer!</p>`;
                        setTimeout(() => {
                            showNextWord();
                        }, 1500);
                    } else {
                        currentBlanksCount--;
                        currentBlanks = newBlanks;
                        gameContainer.innerHTML = `<p>${currentBlanks}</p><p style="color: red;">Incorrect answer! Correct word is: ${currentWord}</p>`;
                        setTimeout(() => {
                            showNextWord();
                        }, 1500);
                    }
                } else {
                    incorrectAnswers++;
                    streakLength = 0;
                    if (!incorrectWords.includes(currentWord)) {
                        incorrectWords.push(currentWord);
                    }
                    questionQueue.push({ word: currentWord, comment: words.find(w => w.word === currentWord).comment });
                    gameContainer.innerHTML += `<p style="color: red;">Incorrect answer! Correct word is: ${currentWord}</p>`;
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
    </script>
</body>
</html>
