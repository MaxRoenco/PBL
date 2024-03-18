let SFX = (localStorage.getItem('SFX') || 'true') === 'true';
let id = (s) => document.getElementById(s);

//quiz
let question = id("question");
let yesBtn = id("yes");
let noBtn = id("no");
let sound = id("soundContainer");
let soundOn = id("soundImageOn");
let soundOff = id("soundImageOff");
let quizContainer = id("wrapper_quizzez");
let voiceImage = id("voiceImage");
let canRecognise = true;
let recognition;
quizContainer.addEventListener("click", e => {
    if (!canRecognise) {
        cancelRecognition();
    } else {
        let arg = '';
        if(language === 'en') arg = 'en-US';
        if(language === 'ro') arg = 'ro-RO';
        if(language === 'ru') arg = 'ru-RU';
        recognizeSpeech(arg);
    }
})

//results
let barWrong = id("barWrong");
let barCorrect = id("barCorrect");

//categories
let cats = {
    'en': ['HISTORY', 'TOURISM', 'JOBS', 'TECHNOLOGY', 'CULTURE', 'ART'],
    'ro': ['ISTORIE', 'TURISM', 'MUNCI', 'TEHNOLOGIE', 'CULTURĂ', 'ARTĂ'],
    'ru': ['ИСТОРИЯ', 'ТУРИЗМ', 'РАБОТЫ', 'ТЕХНОЛОГИИ', 'КУЛЬТУРА', 'ИСКУССТВО'],
}
let frames = document.querySelectorAll(".category-frame");
frames.forEach((ele, i) => {
    ele.addEventListener("click", e => {
        let key = Object.keys(quiz)[i];
        currentCategory = key;
        nextQuestion();
    })
})

// artiom
let score = 0;
let currentCategory = -1;

//wrong ans
let correctCounter =  document.querySelector(".correct_ans-headline");
//correct ans
let wrongCounter =  document.querySelector(".wrong_ans-headline");

//profile stats
let correctCountElement = id("profilecorrect_counter");
let wrongCountElement = id("profilewrong_counter");
let quizCountElement =id("profilequizz_done");

//langs
let langFlags = id("lang_flags");

// initialize
let dataSet = {};
let quiz = {};
let language = localStorage.getItem('language') || 'en';
updateLanguage(language);
fetch('https://65f5f30b41d90c1c5e0a6f6a.mockapi.io/quiz/quizes')
.then(response => response.json())
.then(data => {
    dataSet = data[0];
    quiz = dataSet[language];
})
.catch(error => {
    console.error('Error fetching data:', error);
});
window.onload = function () {
    let body = document.body;
    body.style.opacity = "1";
};
setActive("menu");
updateScore(0);
speak("");


document.querySelector("#correct_answer").style.transform = "translateX(300%)";
document.querySelector("#wrong_answer").style.transform = "translateX(300%)";
document.querySelector("#final_score").style.transform = "translateX(300%)";

// manage local storage variables
let wrongAnswers = +localStorage.getItem('wrongAnswers') || 0;
let correctAnswers = +localStorage.getItem('correctAnswers') || 0;
let quizzesDone = +localStorage.getItem('quizzesDone') || 0;
let isMuted = (localStorage.getItem('isMuted') || false) === 'true';
updateCorrectCount(correctAnswers);
updateWrongCount(wrongAnswers);
updateQuizzesCount(quizzesDone);
updateIsMuted(isMuted);
updateSFX(SFX);

let index = -1;
let canClick = true;
function nextQuestion() {
    setTimeout(() => canClick = true, 100); // click delay
    setActive("quiz");
    show(document.querySelector("#correct_answer"));
    show(document.querySelector("#wrong_answer"));
    show(document.querySelector("#final_score"));
    document.querySelector("#quiz").style.transform = "translateX(0)";
    document.querySelector("#wrong_answer").style.transform = "translateX(300%)";
    document.querySelector("#correct_answer").style.transform = "translateX(300%)";
    index++;
    if (index >= quiz[currentCategory].length) {
        index = -1;
        showResults();
        updateScore(0);
        return;
    }
    let questionText = quiz[currentCategory][index].question
    question.textContent = questionText;
    if (!isMuted) speak(questionText);
    yesBtn.addEventListener("click", e => checkAnswer(1));
    noBtn.addEventListener("click", e => checkAnswer(0));
}

function checkAnswer(ans) {
    if (!canClick) return;
    stopSpeech();
    canClick = false;
    let isCorrect = quiz[currentCategory][index].answer == ans;
    if (isCorrect) {
        updateScore(score + 1);
        updateCorrectCount(correctAnswers + 1);
        document.querySelector("#quiz").style.transform = "translateX(-300%)";
        document.querySelector("#correct_answer").style.transform = "translateX(0)";
        setActive('correct_answer');
        show(document.querySelector("#quiz"));
        show(document.querySelector("#final_score"));
        playSound("./assets/audio/correct.mp3");
    } else {
        updateWrongCount(wrongAnswers + 1);
        document.querySelector("#quiz").style.transform = "translateX(-300%)";
        document.querySelector("#wrong_answer").style.transform = "translateX(0%)";
        setActive('wrong_answer');
        show(document.querySelector("#quiz"));
        show(document.querySelector("#final_score"));
        playSound("./assets/audio/wrong.mp3");
    }
}

function showResults() {
    updateQuizzesCount(quizzesDone + 1);
    playSound("./assets/audio/results.mp3");
    let goodPercentage = (score / quiz[currentCategory].length) * 100;
    let wrongPercentage = 100 - goodPercentage;

    document.querySelector(".final_score-nr").textContent = score + "/" + quiz[currentCategory].length;

    let correctColumn = document.querySelector(".barCorrect");
    let wrongColumn = document.querySelector(".barWrong");

    correctColumn.style.width = `${goodPercentage}%`;
    wrongColumn.style.width = `${wrongPercentage}%`;
    correctColumn.setAttribute('data-after', `${goodPercentage.toFixed(2)}%`);
    wrongColumn.setAttribute('data-after', `${wrongPercentage.toFixed(2)}%`);

    let root = document.documentElement;
    root.style.setProperty('--correct-width', `${goodPercentage}%`);
    root.style.setProperty('--wrong-width', `${wrongPercentage}%`);
    root.style.setProperty('--correct-content', `"${goodPercentage.toFixed(2)}%"`);
    root.style.setProperty('--wrong-content', `"${wrongPercentage.toFixed(2)}%"`);
    let gp = Math.floor(goodPercentage);
    let wp = Math.floor(wrongPercentage);
    barCorrect.textContent =  gp >= 10 ? `${gp}%` : '';
    barWrong.textContent = wp >= 10 ? `${wp}%` : '';
    setActive("final_score");
    show(document.querySelector("#correct_answer"));
    show(document.querySelector("#wrong_answer"));
    document.querySelector("#final_score").style.transform = "translateX(0%)";
    document.querySelector("#wrong_answer").style.transform = "translateX(-300%)";
    document.querySelector("#correct_answer").style.transform = "translateX(-300%)";
}

function show(ele) {
    ele.style.display = "inherit";
}

function hide(ele) {
    ele.style.display = "none";
}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function updateScore(num) {
    score = num;
    document.querySelector(".correct_ans-nr").textContent = score;
    document.querySelector(".wrong_ans-nr").textContent = score;
}

function setActive(tab) {
    playSound("./assets/audio/button.mp3")
    let tabs = document.querySelector("body").children;
    Array.from(tabs).forEach(element => {
        if (element.id === tab) {
            show(element);
        } else {
            hide(element);
        }
    });
}

function speak(text) {
    // Check if the browser supports speech synthesis
    if ('speechSynthesis' in window) {
        // Create a new instance of SpeechSynthesisUtterance
        var msg = new SpeechSynthesisUtterance();

        // Set the text to be spoken
        msg.text = text;

        // Filter voices based on the specified language
        var voices = speechSynthesis.getVoices().filter(function (voice) {
            return voice.lang.startsWith(language !== 'ru' ? 'en' : 'ru');
        });

        // Check if there are voices available for the specified language
        if (voices.length > 0) {
            // Set the voice to the first voice found for the specified language
            msg.voice = voices[0];
        } else {
            console.error("No voices available for the specified language: " + language);
            return;
        }

        // Speak the text
        speechSynthesis.speak(msg);
    } else {
        console.error("Sorry, your browser doesn't support text-to-speech!");
    }
}

function stopSpeech() {
    window.speechSynthesis.cancel();
}

function recognizeSpeech(language) {
    if (!canRecognise) return;
    canRecognise = false;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        
        // Set the language dynamically
        recognition.lang = language;
        recognition.continuous = false;

        recognition.start();
        playSound("./assets/audio/recognitionStart.mp3")

        // Display "Recording now..." message while listening
        // document.getElementById('status').innerText = 'Recording now...';
        voiceImage.style.filter = "invert(1)";

        recognition.onresult = function (event) {
            var transcript = event.results[0][0].transcript;
            let theAnswer = transcript.trim().toLowerCase();
            let yess = ['yes', 'да','da','desigur']
            let nos = ['no', 'нет','nu']
            if (yess.some(e => theAnswer === e)) {
                checkAnswer(1);
            } else if (nos.some(e => theAnswer === e)) {
                checkAnswer(0);
            } else {
                console.log(language);
                if (!isMuted) {
                    if(language === 'en-US') {
                        speak("Sorry, can you repeat that?");
                    } else if(language == 'ru-RU') {
                        speak("Пожалуйста, повторите сказанноe!!!");
                    } else {
                        speak("Sorry, can you repeat that?");
                    }
                }
            }
        };
        recognition.onerror = function (event) {
            console.error('Speech Recognition Error:', event.error);
            if (!isMuted && event.error === 'no-speech') {
                if(language === 'en') {
                    speak("Sorry, can you repeat that?");
                } else if(language == 'ru') {
                    speak("Пожалуйста, повторите сказанное");
                } else {
                    speak("Sorry, can you repeat that?");
                }
            }
        };
        // Reset the status message when recognition ends
        recognition.onend = function () {
            playSound("./assets/audio/recognitionEnd.mp3")
            voiceImage.style.filter = "invert(0)";
            setTimeout(() => {
                canRecognise = true;
            }, 100);
        };
    } else {
        if (!isMuted) speak("Sorry, your browser doesn't support speech recognition!");
    }
}

function cancelRecognition() {
    if (recognition) {
        recognition.abort();
        voiceImage.style.filter = "invert(0)";
    }
}

function updateWrongCount(num) {
    wrongAnswers = num;
    localStorage.setItem('wrongAnswers', num);
    document.querySelector(".profilestats_correct").textContent = num;
}

function updateCorrectCount(num) {
    correctAnswers = num;
    localStorage.setItem('correctAnswers', num);
    document.querySelector(".profilestats_wrong").textContent = num;
}

function updateQuizzesCount(num) {
    quizzesDone = num;
    localStorage.setItem('quizzesDone', num);
    document.querySelector("#profilequizz_done").textContent = num;
}

function toggleSound() {
    playSound("./assets/audio/button.mp3")
    updateIsMuted(!isMuted);
}

function updateIsMuted(bool) {
    isMuted = bool;
    localStorage.setItem('isMuted', bool);
    if (isMuted) {
        stopSpeech();
        hide(soundOn);
        show(soundOff);
    } else {
        hide(soundOff);
        show(soundOn);
    }
}

function resetStats() {
    playSound("./assets/audio/button.mp3")
    updateCorrectCount(0);
    updateWrongCount(0);
    updateQuizzesCount(0);
}

function playSound(path) {
    if(!SFX) return;
    var audio = new Audio(path);
    audio.play();
}

function activateFlag(event) {
    let flags = langFlags.children;

    Array.from(flags).forEach(ele => {
        ele.classList = [];
    })
    event.target.classList.add("languageSelected");
    updateLanguage(event.target.dataset.lang)
    language = event.target.dataset.lang;
}
function updateLanguage(lang) {
    playSound("./assets/audio/button.mp3");
    quiz = dataSet[lang];
    language = lang;
    localStorage.setItem('language', lang);
    Array.from(langFlags.children).forEach(ele => {
        ele.classList = [];
        if(ele.dataset.lang === lang) {
            ele.classList.add("languageSelected");
        }
    })
    Array.from(frames).forEach((ele, i) => {
        ele.children[1].textContent = cats[language][i];
    })
    if(language === 'ro') {
        document.querySelector("#langs_label").textContent = "Limbi";
        document.querySelector(".settings-home").textContent = "Acasă";
        document.querySelector(".start").textContent = "Începe";
        document.querySelector(".categories_headline").textContent = "Categorii";
        document.querySelector(".quiz-headline").textContent = "Quiz";
        document.querySelector("#question").textContent = "Întrebare";
        document.querySelector("#no").textContent = "Nu";
        document.querySelector("#yes").textContent = "Da";
        document.querySelector(".final_score-headline").setAttribute('style', 'white-space: pre;');
        document.querySelector(".final_score-headline").textContent = "Scorul tău \r\nfinal: ";
        document.querySelector(".final_score-home").textContent =     "Acasă";
        document.querySelector(".wrong_ans-headline").textContent =   "Scorul răspunsurilor greșite: ";
        document.querySelector(".wrong_ans-next").textContent =       "Următorul";
        document.querySelector(".correct_ans-headline").textContent = "Scorul răspunsurilor corecte: ";
        document.querySelector(".correct_ans-next").textContent =     "Următorul";
        document.querySelector("#total_right").textContent =          "Total răspunsuri corecte: ";
        document.querySelector("#total_wrong").textContent =          "Total răspunsuri greșite: ";
        document.querySelector("#total_quizzes").textContent =        "Quizuri făcute: ";
        document.querySelector("#resetBoxP").textContent =            "Resetare";
        document.querySelector(".profile_stats-home").textContent =   "Acasă";
        document.querySelector("#SFXText").textContent =              "Efecte Sonore";
    } else if(language === 'ru') {
        document.querySelector("#langs_label").textContent =          "Языки";
        document.querySelector(".settings-home").textContent =        "Главная";
        document.querySelector(".start").textContent =                "Начать";
        document.querySelector(".categories_headline").textContent =  "Категории";
        document.querySelector(".quiz-headline").textContent =        "Викторина";
        document.querySelector("#question").textContent =             "Вопрос";
        document.querySelector("#no").textContent =                   "Нет";
        document.querySelector("#yes").textContent =                  "Да";
        document.querySelector(".final_score-headline").setAttribute('style', 'white-space: pre;');
        document.querySelector(".final_score-headline").textContent = "Ваш итоговый\r\nбалл: ";
        document.querySelector(".final_score-home").textContent =     "Главная";
        document.querySelector(".wrong_ans-headline").textContent =   "Очки за неправильные ответы: ";
        document.querySelector(".wrong_ans-next").textContent =       "Следующий";
        document.querySelector(".correct_ans-headline").textContent = "Очки за правильные ответы: ";
        document.querySelector(".correct_ans-next").textContent =     "Следующий";
        document.querySelector("#total_right").textContent =          "Всего правильных ответов: ";
        document.querySelector("#total_wrong").textContent =          "Всего неправильных ответов: ";
        document.querySelector("#total_quizzes").textContent =        "Пройденные викторины: ";
        document.querySelector("#resetBoxP").textContent =            "Сбросить";
        document.querySelector(".profile_stats-home").textContent =   "Главная";
        document.querySelector("#SFXText").textContent =              "Звуковые Эффекты";
    } else {
        document.querySelector("#langs_label").textContent =          "Languages";
        document.querySelector(".settings-home").textContent =        "Home";
        document.querySelector(".start").textContent =                "Start";
        document.querySelector(".categories_headline").textContent =  "Categories";
        document.querySelector(".quiz-headline").textContent =        "Quiz";
        document.querySelector("#question").textContent =             "Question";
        document.querySelector("#no").textContent = "No";
        document.querySelector("#yes").textContent =                  "Yes";
        document.querySelector(".final_score-headline").setAttribute('style', 'white-space: pre;');
        document.querySelector(".final_score-headline").textContent = "Your final \r\nScore: ";
        document.querySelector(".final_score-home").textContent =     "Home";
        document.querySelector(".wrong_ans-headline").textContent =   "Wrong answer Score: ";
        document.querySelector(".wrong_ans-next").textContent =       "Next";
        document.querySelector(".correct_ans-headline").textContent = "Correct answer Score: ";
        document.querySelector(".correct_ans-next").textContent =     "Next";
        document.querySelector("#total_right").textContent =          "Total right answers: ";
        document.querySelector("#total_wrong").textContent =          "Total wrong answers: ";
        document.querySelector("#total_quizzes").textContent =        "Quizzes done: ";
        document.querySelector("#resetBoxP").textContent =            "Reset";
        document.querySelector(".profile_stats-home").textContent =   "Home";
        document.querySelector("#SFXText").textContent =              "Sound Effects";
    }
    
     //correct_ans_counter
     let correctSpan = document.createElement("span");
     correctSpan.classList.add("correct_ans-nr");
     correctSpan.textContent = '0';
     correctCounter.append(correctSpan);

     //wrong_ans_counter
     let wrongSpan = document.createElement("span");
     wrongSpan.classList.add("wrong_ans-nr");
     wrongSpan.textContent = '0';
     wrongCounter.append(wrongSpan);

     //final score
    let finalResult = document.createElement("span");
    finalResult.classList.add("final_score-nr");
    finalResult.textContent = '0';
    finalResult.style.fontFamily = "PoetsenOne";
    document.querySelector(".final_score-headline").append(finalResult);

    //corect stat
    let correctStat = document.createElement("span");
    correctStat.classList.add("profilestats_correct");
    correctStat.textContent = '0';
    document.querySelectorAll(".profilestats-headline")[0].append(correctStat);

    //wront stat
    let wrongStat = document.createElement("span");
    wrongStat.classList.add("profilestats_wrong");
    wrongStat.textContent = '0';
    document.querySelectorAll(".profilestats-headline")[1].append(wrongStat);

    //wront stat
    let quizStat = document.createElement("span");
    quizStat.id = "profilequizz_done";
    quizStat.textContent = '0';
    document.querySelectorAll(".profilestats-headline")[2].append(quizStat);
}

function finalScoreButtonHandler() {
    setActive("menu");
    document.querySelector("#correct_answer").style.transform = "translateX(300%)";
    document.querySelector("#wrong_answer").style.transform = "translateX(300%)";
    document.querySelector("#final_score").style.transform = "translateX(300%)";
}

function toggleSFX() {
    playSound("./assets/audio/button.mp3")
    console.log(SFX)
    updateSFX(!SFX);
}

function updateSFX(bool) {
    SFX = bool;
    localStorage.setItem('SFX', bool);
    if (SFX) {
        hide(document.querySelector("#settingsImageSoundsOff"));
        show(document.querySelector("#settingsImageSoundsOn"));
    } else {
        show(document.querySelector("#settingsImageSoundsOff"));
        hide(document.querySelector("#settingsImageSoundsOn"));
    }
}