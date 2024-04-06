let dataSet = {};
let language = 'en';
let soundOn = true;
let currentTab = "home";
let questionIndex = 0;
let correct = 0;
let previewMode = false;
let progression = {
    "html": 0,
    "css": 0,
    "js": 0,
    "python": 0,
    "c":0,
    "c++": 0,
    "diamonds": 0,
    "hearts": 0
}

let currCategory = "";
let currLevel = 0;
let offlineMode = false;
let isLastLesson = false;
let numberOfQuestions = 0;
let swipeOn = true;
let previewQuestions = [];

function loadProgression() {
    let loadedProgress = localStorage.getItem("progress");
    if(!loadedProgress) {
        localStorage.setItem("progress", JSON.stringify(progression));
    } else {
        progression = JSON.parse(loadedProgress);
    }
}

function updateProgression(cat, val) {
    progression[cat] = val;
    localStorage.setItem("progress", JSON.stringify(progression));
}

function resetProgression() {
    let newProgression = {
        "html": 0,
        "css": 0,
        "js": 0,
        "python": 0,
        "c":0,
        "c++": 0,
        "diamonds": 0,
        "hearts": 0
    }
    progression = newProgression;
    localStorage.setItem("progress", JSON.stringify(newProgression));
    openTab("home", 'l')
}

function openTab(tabName, dir) {
    playSound("./assets/sounds/tap.mp3");
    let buttons = [
        {id: "settingsIcon", tab: ["home"]}, 
        {id: "profileIcon", tab: ["home"]}, 
        {id: "categoriesReturn", tab: ["categories"]}, 
        {id: "lessonsReturn", tab: ["lessons"]},
        {id: "createBtn", tab: ["home", "wifi"]},
    ]

    buttons.forEach(ele => {
        if(ele.tab.includes(tabName)) {
            document.getElementById(ele.id).classList.remove("hidden");
        } else {
            document.getElementById(ele.id).classList.add("hidden");
        }
    })

    let curr = document.querySelector(`[data-tab="${currentTab}"]`);
    if(tabName === currentTab) {
        curr.style.display = "";
        return;
    };

    let next = document.querySelector(`[data-tab="${tabName}"]`);
    if(dir === 'l') {
        next.style.transform = "translate(-200%)";
        curr.style.transform = "translate(200%)";
    } else {
        next.style.transform = "translate(200%)";
        curr.style.transform = "translate(-200%)";
    }
    
    setTimeout(_ => {
        curr.style.display = "none";
        next.style.display = "";
        setTimeout(_ => {
            next.style.transform = "translate(0%)";
        }, 15)
    }, 250)
    currentTab = tabName;

    if(tabName === 'categories') {
        let cats = ['html', 'css', 'js', 'python', 'c', 'c++'];
        cats.forEach(e => {
            let len = dataSet["en"]["categories"][e].length;
            let ele = document.getElementById(e);
            if(len < 1) {
                ele.classList.add("categoryLocked");
            } else {
                ele.classList.remove("categoryLocked");
            }
        })
    } else if(tabName === 'removeLesson') {
        catDeleteChangehandler();
    }
}

async function fetchData() {
    try {
        const response = await fetch('test.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        saveData(data);
        catDeleteChangehandler();
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

function moveToLesson(lessonName, data, dir) {
    openTab("lessons", dir);
    let container = document.getElementById("lessons");
    container.replaceChildren();
    data["en"]["categories"][lessonName].forEach((ele, i) => {
        let lessonElement = document.createElement("div");
        let lessonNumSpan = document.createElement("span");
        
        lessonNumSpan.textContent = `Lesson ${i+1}:`;
        lessonNumSpan.classList.add("lesson-span");
        lessonElement.classList.add("lesson");
        let newLine = document.createElement("br");
        let lessonContentSpan = document.createElement("span");
        if(+progression[lessonName] < i) {
            lessonElement.classList.add("locked")
            let img = document.createElement("img");
            img.src = "./assets/images/lock.png";
            img.classList.add("lockImage");
            lessonElement.append(img);
        };
        lessonContentSpan.textContent = ele["title"];
        container.append(lessonElement);
        lessonElement.append(lessonNumSpan);
        lessonElement.append(newLine);
        lessonElement.append(lessonContentSpan);

        lessonElement.addEventListener("click", _ => {
            currCategory = lessonName;
            currLevel = i;
            numberOfQuestions = data["en"]["categories"][lessonName][i]["quiz"].length;
            isLastLesson = i+1 === data["en"]["categories"][lessonName].length;
            openContent(ele);
        })
    })
}

function openContent(obj) {
    openTab("content", 'r');
    let container = document.querySelector('#textContent');
    container.replaceChildren();
    compileLesson(obj["content"], container);
    let button = document.querySelector('#openLesson');
    button = removeAllEventListeners(button);
    button.addEventListener("click", _ => {
        let btn = document.getElementById("toQuizBtn");
        if(numberOfQuestions) {
            btn.textContent = 'Quiz';
        } else {
            btn.textContent = 'Finish lesson';
        }
        openLesson(obj);
    })
}

function openLesson(obj) {
    openTab("lesson", 'r');
    let container = document.querySelector('#textLesson');
    container.replaceChildren();
    compileLesson(obj["lesson"], container);
    let quizButton = document.getElementById("quizStart");
    quizButton = removeAllEventListeners(quizButton);
    quizButton.addEventListener("click", _ => {
        startQuiz(obj);
    })
}

function startQuiz(obj) {
    questionIndex = 0;
    correct = 0;
    nextQuestion(obj['quiz']);
}

function nextQuestion(questions) {
    if(questionIndex >= questions.length) {
        showResults(questions.length);
        return;
    }

    document.getElementById(`questionNum${questionIndex%2}`).textContent = `Question ${questionIndex+1}`;
    document.getElementById(`questionText${questionIndex%2}`).textContent = questions[questionIndex]['question'];
    let optionsEle = document.getElementById(`options${questionIndex%2}`);
    optionsEle.replaceChildren();
    questions[questionIndex]['options'].forEach((ele, i) => {
        let opt = document.createElement("div");
        opt.classList.add("option");
        opt.addEventListener("click", e => {
            if(questions[questionIndex-1]["correctAnswer"] === i) {
                correct++;
            }
            nextQuestion(questions);
        })
        opt.textContent = ele;
        optionsEle.append(opt);
    })
    openTab(`question${questionIndex%2}`, 'r');
    questionIndex++;
}

function setActiveLanguage(lang) {
    playSound("./assets/sounds/tap.mp3");
    language = lang;
    let langs = ['en', 'ru', 'ro'];
    langs.forEach( ele => {
        if(lang == ele) {
            document.getElementById(ele).classList.add("active");
        } else {
            document.getElementById(ele).classList.remove("active");
        }
    })
    playSound(`./assets/sounds/${lang}.mp3`);
}

function showResults(total) {
    playSound("./assets/sounds/levelup.mp3")
    isLastLesson = currLevel+1 === dataSet["en"]["categories"][currCategory].length;
    let res = document.getElementById("resultsElement");
    let btn = document.getElementById("resultsNextBtn");
    let cir = document.querySelector(".circuitDiagram");
    let per = document.getElementById("resultsPercent");
    let showBtn = document.getElementById("resultsShowBtn");
    if(total) {
        res.textContent = "You got " + correct + '/' + total + " correct";
        cir.style.background = `conic-gradient(white ${Math.floor(correct*360/total)}deg, rgb(255, 255, 255, 0.1) 0deg)`;
        per.textContent = `${Math.floor(correct*100/total)}%`
        cir.style.display = '';
        if(currLevel === progression[currCategory] && !previewMode) {
            updateDiamonds(progression["diamonds"]+100);
        }
    } else {
        res.textContent = "Lesson complete.";
        cir.style.display = 'none';
    }
    document.getElementById("resultsHomeBtn").textContent = previewMode ? "End Preview" : "Home";
    openTab("results", 'r');
    if(!previewMode && !isLastLesson) {
        btn.style.display = '';
    } else {
        btn.style.display = 'none';     
    }
    if(currLevel >= progression[currCategory] && !previewMode) {
        updateProgression(currCategory, currLevel+1);
    }
    if(dataSet["en"]["categories"][currCategory][currLevel]["quiz"].length) {
        showBtn.style.display = '';
    } else {
        showBtn.style.display = 'none';
    }
}

function toggleSoundEffects() {
    soundOn = !soundOn;
    playSound("./assets/sounds/tap.mp3");
    if(soundOn) {
        document.getElementById("soundOff").style.display = 'none';
        document.getElementById("soundOn").style.display = 'inherit';
    } else {
        document.getElementById("soundOn").style.display = 'none';
        document.getElementById("soundOff").style.display = 'inherit';
    }
}

function compileLesson(string, parent) {
    string += '\n';
    let i = 0;  
    while(i < string.length)
    {
        let element;
        if(string[i] === '#' && string[i+1] === "#") {
            element = document.createElement("h2");
            i+=2;
            while(string[i] !== '\n' && i < string.length) {
                element.textContent += string[i];
                i++;
            }
        } else if(string[i] === '#') {
            element = document.createElement("h1");
            i++;
            while(string[i] !== '\n' && i < string.length) {
                element.textContent += string[i];
                i++;
            }
        } else if(string[i] === '$') {
            element = document.createElement("img");
            let s = ""
            i++;
            while(string[i] !== '\n' && i < string.length) {
                s += string[i];
                i++;
            }
            element.src = s;
        } else if(string[i] === '>' || string[i] === '\r' || string[i] === '\n') {
            element = document.createElement("br");
            i++;
        } else if(string[i] === '\\') {
            element = document.createElement("p");
            i++;
            while(string[i] !== '\n' && i < string.length) {
                element.textContent += string[i];
                i++;
            }
        } else if(string[i] === '`') {
            element = document.createElement("code");
            element.setAttribute('style', 'white-space: pre;');
            i++;
            while(string[i] !== '`' && i < string.length) {
                if(string[i] === '\n') {
                    element.textContent += '\n\r';
                } else {
                    element.textContent += string[i];
                }
                i++;
            }
        } else {
            element = document.createElement("p");
            while(string[i] !== '\n' && i < string.length) {
                element.textContent += string[i];
                i++
            }
        }
        parent.append(element);
    }
}

function removeAllEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.parentNode.replaceChild(clonedElement, element);
    return clonedElement;
}

function createLesson() {
    let cat = document.getElementById("chooseCategory").value;
    let title = document.getElementById("chooseTitle").value;
    let content = document.getElementById("contentArea").value;
    let lesson = document.getElementById("lessonArea").value;
    let obj = {
        "title" : title.trim() === '' ? "Untitled" : title.trim(),
        "content" : content.trim() === '' ? "# Empty introduction" : content,
        "lesson" : lesson.trim() === '' ? "# Empty lesson" : lesson,
        "quiz" : []
    }
    let addBtn = document.getElementById("addBtn");
    addBtn = removeAllEventListeners(addBtn);
    let previewBtn = document.getElementById("previewBtn");
    previewBtn = removeAllEventListeners(previewBtn);

    previewBtn.addEventListener("click", _ => {
        let previewObj = {"en": {"categories": {}}}
        previewObj["en"]["categories"][cat] = [obj];
        moveToLesson(cat, previewObj, 'r');
        previewMode = true;
    })
    addBtn.addEventListener("click", _ => {
        dataSet["en"]["categories"][cat].push(obj);
        saveData(dataSet);
        moveToLesson(cat, dataSet, 'r');
    })

    let allQuestions = Array.from(document.getElementById("allQuestions").children);
    allQuestions.forEach(e => {
        let elements = Array.from(e.children);
        let question = elements[0].textContent.replace("Question: ", "");
        let options = Array.from(elements[1].children).map(ele => ele.textContent);
        let correctAnswer = options.indexOf(elements[2].textContent.replace("Answer: ", ""));
        let quiz = {
            "question": question,
            "options": options,
            "correctAnswer": correctAnswer
        }
        obj.quiz.push(quiz);
    })
    previewQuestions = obj["quiz"];
    openTab("finalCreator", "r");
}

function lessonsReturnHandler() {
    if(previewMode) {
        openTab("finalCreator", 'l');
        previewMode = false;
    } else {
        openTab("categories", 'l');
    }
}

function cancelAdding() {
    openTab("home", 'l');
    document.getElementById("chooseCategory").value = "html";
    document.getElementById("chooseTitle").value = "";
    document.getElementById("contentArea").value = "";
    document.getElementById("lessonArea").value = "";
}

function catDeleteChangehandler() {
    let cat = document.getElementById("chooseCategoryDelete").value;
    let lessons = dataSet["en"]["categories"][cat].map(ele => ele.title);
    let lessonDrop = document.getElementById("chooseLessonDelete");
    lessonDrop.replaceChildren();
    lessons.forEach(ele => {
        let opt = document.createElement("option");
        opt.textContent = ele;
        opt.value = ele;
        document.getElementById("chooseLessonDelete").append(opt);
    })

}

function removeLessonHandler() {
    let cat = document.getElementById("chooseCategoryDelete").value;
    let lesson = document.getElementById("chooseLessonDelete").value;
    dataSet["en"]["categories"][cat] = dataSet["en"]["categories"][cat].filter(ele => ele.title !== lesson);
    saveData(dataSet);
    openTab("home", 'l');
}

function saveData(obj) {
  localStorage.setItem("dataSet", JSON.stringify(obj));
  window.dataSet = dataSet;
}

function getData(key) {
  const storedItem = localStorage.getItem("dataSet");
  if(storedItem) {
    dataSet = JSON.parse(storedItem);
    window.dataSet = dataSet;
  } else {
    fetchData();
  }
}

function resetDataSet() {
    fetchData();
    openTab("home", "l");
}

function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(dataSet))
    .then(() => {
        alert("Json object was copied! paste it in this site to make it pretty!");
        window.open("https://jsonformatter.org/json-pretty-print", '_blank');
    })
    .catch(err => {
        console.error('Failed to copy:', err);
    });
}

function addAnswer() {
    let input = document.getElementById("addAnswerInput");
    let answersContainer = document.getElementById("answersList");
    let element = document.createElement("li");
    let removeBtn = document.createElement("button");
    if(input.value.trim() === "") return;
    element.textContent = input.value;
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("removeAnswerBtn");
    element.append(removeBtn);
    answersContainer.append(element);
    
    let selector = document.getElementById("selectCorrectAnswer");
    let opt = document.createElement("option");
    opt.value = input.value;
    opt.textContent = input.value;
    selector.append(opt);
    removeBtn.addEventListener("click", e => {
        element.remove();
        opt.remove();
    })
    input.value = "";
}

function addQuestion() {
    let question = document.getElementById("addQuestionInput");
    let answersElements = document.getElementById("answersList");
    let correctAnswer = document.getElementById("selectCorrectAnswer").value;
    let answers = Array.from(answersElements.children).map(e => e.textContent.replace("Remove", ""));


    let questionContainer = document.createElement("div");
    let questionText = document.createElement("h3");
    let answersContainer = document.createElement("ul")
    answersContainer.classList.add("addedUl");
    let correctAnswerText = document.createElement("h3");
    let removeButton = document.createElement("button");
    removeButton.classList.add("addedBtn");
    document.getElementById("addAnswerInput").value = "";

    questionText.textContent = "Question: " + question.value;
    questionText.classList.add("addedQuestion");
    answers.forEach(answer => {
        let li = document.createElement("li");
        li.textContent = answer;
        li.classList.add("addedAnswer");
        answersContainer.append(li);
    })
    correctAnswerText.textContent = "Answer: " + correctAnswer;
    correctAnswerText.classList.add("addedCorrect");
    removeButton.textContent = "Remove";
    questionContainer.append(questionText, answersContainer, correctAnswerText, removeButton);
    questionContainer.classList.add("qContainer");
    question.value = "";
    answersElements.replaceChildren();
    document.getElementById("selectCorrectAnswer").replaceChildren();
    document.getElementById("allQuestions").append(questionContainer);
    removeButton.addEventListener("click", e => {
        questionContainer.remove();
    })
}

function resultsHome() {
    if(previewMode) {
        openTab('finalCreator', 'l');
    } else {
        openTab('home', 'l');
    }
    previewMode = false;
}

function openProfile() {

    //html
    let htmlBar = document.querySelector("#htmlLine");
    let htmlPerc = document.querySelector("#htmlPerc");
    let htmlTotal = dataSet["en"]["categories"]["html"].length;
    let htmlDone = progression["html"];
    let htmlPercentage = htmlTotal ? Math.floor(htmlDone*100/htmlTotal) : 0;
    htmlBar.style.background = `linear-gradient(to right, rgb(219, 176, 56) ${htmlPercentage}%, rgb(153, 153, 153) ${1 - htmlPercentage}%)`;
    htmlPerc.textContent = htmlPercentage+"%";
    if(htmlPercentage === 100) {
        document.getElementById("htmlImg").src = "./assets/images/treasureOpen.png"
    } else {
        document.getElementById("htmlImg").src = "./assets/images/treasure.png"
    }

    //css
    let cssBar = document.querySelector("#cssLine");
    let cssPerc = document.querySelector("#cssPerc");
    let cssTotal = dataSet["en"]["categories"]["css"].length;
    let cssDone = progression["css"];
    let cssPercentage = cssTotal ? Math.floor(cssDone*100/cssTotal) : 0;
    cssBar.style.background = `linear-gradient(to right, rgb(219, 176, 56) ${cssPercentage}%, rgb(153, 153, 153) ${1 - cssPercentage}%)`;
    cssPerc.textContent = cssPercentage+"%";
    if(cssPercentage === 100) {
        document.getElementById("cssImg").src = "./assets/images/treasureOpen.png"
    } else {
        document.getElementById("cssImg").src = "./assets/images/treasure.png"
    }

    //js
    let jsBar = document.querySelector("#jsLine");
    let jsPerc = document.querySelector("#jsPerc");
    let jsTotal = dataSet["en"]["categories"]["js"].length;
    let jsDone = progression["js"];
    let jsPercentage = jsTotal ? Math.floor(jsDone*100/jsTotal) : 0;
    jsBar.style.background = `linear-gradient(to right, rgb(219, 176, 56) ${jsPercentage}%, rgb(153, 153, 153) ${1 - jsPercentage}%)`;
    jsPerc.textContent = jsPercentage+"%";
    if(jsPercentage === 100) {
        document.getElementById("jsImg").src = "./assets/images/treasureOpen.png"
    } else {
        document.getElementById("jsImg").src = "./assets/images/treasure.png"
    }

    //c
    let cBar = document.querySelector("#cLine");
    let cPerc = document.querySelector("#cPerc");
    let cTotal = dataSet["en"]["categories"]["c"].length;
    let cDone = progression["c"];
    let cPercentage = cTotal ? Math.floor(cDone*100/cTotal) : 0;
    cBar.style.background = `linear-gradient(to right, rgb(219, 176, 56) ${cPercentage}%, rgb(153, 153, 153) ${1 - cPercentage}%)`;
    cPerc.textContent = cPercentage+"%";
    if(cPercentage === 100) {
        document.getElementById("cImg").src = "./assets/images/treasureOpen.png"
    } else {
        document.getElementById("cImg").src = "./assets/images/treasure.png"
    }

    //cpp
    let cppBar = document.querySelector("#cppLine");
    let cppPerc = document.querySelector("#cppPerc");
    let cppTotal = dataSet["en"]["categories"]["c++"].length;
    let cppDone = progression["c++"];
    let cppPercentage = cppTotal ? Math.floor(cppDone*100/cppTotal) : 0;
    cppBar.style.background = `linear-gradient(to right, rgb(219, 176, 56) ${cppPercentage}%, rgb(153, 153, 153) ${1 - cppPercentage}%)`;
    cppPerc.textContent = cppPercentage+"%";
    if(cppPercentage === 100) {
        document.getElementById("cppImg").src = "./assets/images/treasureOpen.png"
    } else {
        document.getElementById("cppImg").src = "./assets/images/treasure.png"
    }

    //python
    let pythonBar = document.querySelector("#pythonLine");
    let pythonPerc = document.querySelector("#pythonPerc");
    let pythonTotal = dataSet["en"]["categories"]["python"].length;
    let pythonDone = progression["python"];
    let pythonPercentage = pythonTotal ? Math.floor(pythonDone*100/pythonTotal) : 0;
    pythonBar.style.background = `linear-gradient(to right, rgb(219, 176, 56) ${pythonPercentage}%, rgb(153, 153, 153) ${1 - pythonPercentage}%)`;
    pythonPerc.textContent = pythonPercentage+"%";
    if(pythonPercentage === 100) {
        document.getElementById("pythonImg").src = "./assets/images/treasureOpen.png"
    } else {
        document.getElementById("pythonImg").src = "./assets/images/treasure.png"
    }

    updateDiamonds();
    updateHearts();
    openTab("profile", 'r');
}

function toggleWifiMode(oldTab) {
    let btn = document.getElementById("wifiModeBtn");
    if(offlineMode) {
        btn.textContent = "Offline mode";
    } else {
        btn.textContent = "Online mode";
    }
    offlineMode = !offlineMode;
    openTab(oldTab, 'l');
}

function nextLesson() {
    if(currLevel+1 >= dataSet["en"]["categories"][currCategory].length) return;
    currLevel++;
openContent(dataSet["en"]["categories"][currCategory][currLevel], 'r');
numberOfQuestions = dataSet["en"]["categories"][currCategory][currLevel]["quiz"].length;
}

function playSound(soundPath) {
    if(!soundOn) return;
    var audio = new Audio(soundPath);
    audio.play();
}

function mute() {
    soundOn = false;
}

function unMute() {
    soundOn = true;
}

function goToStartQuiz(dir) {
    if(numberOfQuestions) {
        openTab("quiz", dir);
    } else {
        showResults();
    }
}

function backToLessons() {
    moveToLesson(currCategory, dataSet, 'l');
}

function updateDiamonds(count, silent) {
    if(count === undefined) {
        updateDiamonds(progression["diamonds"], true);
        return;
    }
    if(!silent) {
        let diff = count - progression["diamonds"];
        notify((diff > 0 ? "+"+diff : diff) + " diamonds", "./assets/images/diamands.png");
    }
    updateProgression("diamonds", count);
    let profileDiamonds = document.getElementById("diamondsCount")
    profileDiamonds.textContent = count;
}

function updateHearts(count, silent) {
    if(count === undefined) {
        updateHearts(progression["hearts"], true);
        return;
    }
    if(!silent) {
        let diff = count - progression["hearts"];
        notify((diff > 0 ? "+"+diff : diff) + " hearts", "./assets/images/heart.png");
    }
    
    updateProgression("hearts", count);
    let profileHearts = document.getElementById("heartsCount")
    profileHearts.textContent = count;
}

function notify(text, imgPath, duration = 3500) {
    let not = document.getElementById("notificationAdd");
    not.replaceChildren();
    not.textContent = text;
    if(imgPath) {
        let img = document.createElement("img");
        img.src = "./assets/images/heart.png";
        img.setAttribute("style", "width:50px;padding-left:20px;");
        not.appendChild(img);
    }
    not.style.transform = "translateY(0)";
    setTimeout(_ => {
        not.style.transform = "translateY(-300%)";
    }, duration)
}

function showAnswers() {
    openTab("answers", 'r');
    let answersContainer = document.getElementById("allAnswers");
    answersContainer.replaceChildren();
    let questions;
    if(previewMode) {
        questions = previewQuestions;
    } else {
        questions = dataSet["en"]["categories"][currCategory][currLevel]["quiz"];
    }
    questions.forEach(ele => {
        let answerDiv = document.createElement("div");
        answerDiv.setAttribute("style", "border: white solid 3px; padding: 10px;");
        let question = document.createElement("h2");
        let answer = document.createElement("h2");
        question.textContent = ele["question"];
        answer.textContent = "Answer: " + ele["options"][+ele["correctAnswer"]];
        answerDiv.append(question, answer);
        answersContainer.append(answerDiv);
    });
}

function toggleSwipe() {
    swipeOn = !swipeOn;
    let on = document.getElementById("swipeOn");
    let off = document.getElementById("swipeOff");
    if(swipeOn) {
        on.style.display = 'inherit';
        off.style.display = 'none';
    } else {
        off.style.display = 'inherit';
        on.style.display = 'none';
    }
}

function goLeft() {
    if(!swipeOn) return;
    if(currentTab === 'home') {
        openTab('settings', 'l');
    } else if(currentTab === 'categories') {
        openTab('home', 'l');
    } else if(currentTab === 'profile') {
        openTab('home', 'l');
    } else if(currentTab === 'lessons') {
        lessonsReturnHandler();
    } else if(currentTab === 'content') {
        backToLessons();
    } else if(currentTab === 'lesson') {
        openTab('content', 'l')
    } else if(currentTab === 'quiz') {
        openTab('lesson', 'l')
    } else if(currentTab === 'results') {
        resultsHome();
    } else if(currentTab === 'actions') {
        cancelAdding()
    } else if(currentTab === 'removeLesson') {
        openTab('actions', 'l');
    } else if(currentTab === 'titleCreator') {
        openTab('actions', 'l')
    } else if(currentTab === 'contentCreator') {
        openTab('titleCreator', 'l')
    } else if(currentTab === 'lessonCreator') {
        openTab('contentCreator', 'l')
    } else if(currentTab === 'quizCreator') {
        openTab('lessonCreator', 'l')
    } else if(currentTab === 'finalCreator') {
        openTab('quizCreator', 'l')
    }

}

function goRight() {
    if(!swipeOn) return;
    if(currentTab === 'home') {
        openProfile();
    } else if(currentTab === 'settings') {
        openTab('home', 'r');
    } else if(currentTab === 'content') {
        document.getElementById("openLesson").click();
    } else if(currentTab === 'lesson') {
        goToStartQuiz('r')
    } else if(currentTab === 'quiz') {
        document.getElementById("quizStart").click();
    } else if(currentTab === 'results') {
        nextLesson();
    } else if(currentTab === 'titleCreator') {
        openTab('contentCreator', 'r')
    } else if(currentTab === 'contentCreator') {
        openTab('lessonCreator', 'r')
    } else if(currentTab === 'lessonCreator') {
        openTab('quizCreator', 'r')
    } else if(currentTab === 'quizCreator') {
        createLesson()
    }
}

window.openTab = openTab;
window.moveToLesson = moveToLesson;
window.setActiveLanguage = setActiveLanguage;
window.toggleSoundEffects = toggleSoundEffects;
window.lessonsReturnHandler = lessonsReturnHandler;
window.cancelAdding = cancelAdding;
window.createLesson = createLesson;
window.catDeleteChangehandler = catDeleteChangehandler;
window.removeLessonHandler = removeLessonHandler;
window.fetchData = fetchData;
window.resetDataSet = resetDataSet;
window.copyJson = copyJson;
window.addAnswer = addAnswer;
window.addQuestion = addQuestion;
window.resultsHome = resultsHome;
window.resetProgression = resetProgression;
window.openProfile = openProfile;
window.toggleWifiMode = toggleWifiMode;
window.nextLesson = nextLesson;
window.goToStartQuiz = goToStartQuiz;
window.backToLessons = backToLessons;
window.dataSet = dataSet;
window.updateDiamonds = updateDiamonds;
window.updateHearts = updateHearts;
window.showAnswers = showAnswers;
window.toggleSwipe = toggleSwipe;

export { openTab, fetchData, getData, loadProgression, currentTab, offlineMode, mute, unMute, updateDiamonds, updateHearts, goRight, goLeft, removeAllEventListeners};