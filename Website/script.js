let dataSet = {};
let soundOn = true;
let currentTab = "home";
let questionIndex = 0;
let correct = 0;
let previewMode = false;
let canBuy = true;
let defaultProgression = {
    "html": 0,
    "css": 0,
    "js": 0,
    "python": 0,
    "c":0,
    "cpp": 0,
    "diamonds": 5000,
    "hearts": 100,
    "language": 'en',
    "soundOn": true,
    "swipeOn": true,
    "username": '',
    "htmlDone": false,
    "cssDone": false,
    "jsDone": false,
    "pythonDone": false,
    "cDone": false,
    "cppDone": false,
    "giga" : {
        "value": 0,
        "total": 1000,
        "calimed": false,
    },
    "crazy" : {
        "value": 0,
        "total": 2000,
        "calimed": false,
    },
    "designer" : {
        "value": 0,
        "total": 5,
        "calimed": false,
    },
    "doom" : {
        "value": 0,
        "total": 6,
        "calimed": false,
    },
    "skins": {
        "cursorMouse1": true,
        "cursorMouse2": true,
        "cursorMouse3": false,
        "cursorMouse4": false,
    }
}

let progression = JSON.parse(JSON.stringify(defaultProgression));
let currCategory = "";
let currLevel = 0;
let offlineMode = false;
let isLastLesson = false;
let numberOfQuestions = 0;
let swipeOn = true;
let previewQuestions = [];
let muted = false;
let editMode = false;
let editTitle = "";
let editCategory = "";
let boosted = false;


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
    progression = JSON.parse(JSON.stringify(defaultProgression));
    localStorage.setItem("progress", JSON.stringify(progression));
    openTab("home", 'l');
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

    if(tabName === "actions" || tabName === "home") {
        editMode = false;
        previewMode = false;
    }

    if(tabName === 'categories') {
        let cats = ['html', 'css', 'js', 'python', 'c', 'cpp'];
        cats.forEach(e => {
            let len = dataSet[progression["language"]]["categories"][e].length;
            let ele = document.getElementById(e);
            if(len < 1) {
                ele.classList.add("categoryLocked");
            } else {
                ele.classList.remove("categoryLocked");
            }
        })
    } else if(tabName === 'removeLesson') {
        catDeleteChangehandler();
    } else if(tabName === 'profile') {
        setTimeout(_=> {
            document.querySelector(".sidesProfile").scrollTo(0,0);
        }, 500)
    }
    setTimeout(_=> {
        next.scrollTo(0,0);
    }, 500)
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
    data[progression["language"]]["categories"][lessonName].forEach((ele, i) => {
        let lessonElement = document.createElement("div");
        let lessonNumSpan = document.createElement("span");
        let l = progression["language"];
        let lessonWord = 'Lesson'
        if(l === 'ro') {
            lessonWord = 'Lectia';
        } else if(l === 'ru') {
            lessonWord = 'Урок';
        }
        lessonNumSpan.textContent = `${lessonWord} ${i+1}:`;
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
            if(progression["hearts"] < 1) {
                notify("You don't have enough hearts!");
                return;
            };
            currCategory = lessonName;
            currLevel = i;
            numberOfQuestions = data[progression["language"]]["categories"][lessonName][i]["quiz"].length;
            isLastLesson = i+1 === data[progression["language"]]["categories"][lessonName].length;
            openContent(ele);
            updateHearts(progression["hearts"]-1);
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
        let btn = document.getElementById("langQuizBtn");
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
    updateProgression("language", lang);
    let langs = ['en', 'ru', 'ro'];
    langs.forEach( ele => {
        if(lang == ele) {
            document.getElementById(ele).classList.add("active");
        } else {
            document.getElementById(ele).classList.remove("active");
        }
    })
    let elements = dataSet[lang]["elements"];
    for (const [key, value] of Object.entries(elements)) {
        document.getElementById(key).textContent = value;
    }

}

function showResults(total) {
    playSound("./assets/sounds/levelup.mp3")
    isLastLesson = currLevel+1 === dataSet[progression["language"]]["categories"][currCategory].length;
    let res = document.getElementById("resultsElement");
    let btn = document.getElementById("resultsNextBtn");
    let cir = document.querySelector(".circuitDiagram");
    let per = document.getElementById("resultsPercent");
    let showBtn = document.getElementById("resultsShowBtn");
    let completedQuiz = correct/total >= 0.5 || !total;
    let lang = progression["language"];
    if(total) {
        if(lang === 'ru') {
            res.textContent = "Вы правильно набрали " + correct + '/' + total;
        } else if(lang === 'ro') {
            res.textContent = "Ai corect " + correct + '/' + total;
        } else {
            res.textContent = "You got " + correct + '/' + total + " correct";
        }
        cir.style.background = `conic-gradient(white ${Math.floor(correct*360/total)}deg, rgb(255, 255, 255, 0.1) 0deg)`;
        per.textContent = `${Math.floor(correct*100/total)}%`
        cir.style.display = '';
        if(currLevel === progression[currCategory] && !previewMode && completedQuiz) {
            let amount = 100*(boosted+1);
            updateDiamonds(progression["diamonds"]+amount);
        }
    } else {
        if(lang === 'ru') {
            res.textContent = "Урок завершен.";
        } else if(lang === 'ro') {
            res.textContent = "Lecția completă.";
        } else {
            res.textContent = "Lesson complete.";
        }
        cir.style.display = 'none';
    }
    if(lang === 'ru') {
        document.getElementById("resultsHomeBtn").textContent = previewMode ? "Завершить просмотр" : "домашняя страница";
    } else if(lang === 'ro') {
        document.getElementById("resultsHomeBtn").textContent = previewMode ? "Încheiați previzualizarea" : "Acasă";
    } else {
        document.getElementById("resultsHomeBtn").textContent = previewMode ? "End Preview" : "Home";
    }
    openTab("results", 'r');
    if(!previewMode && !isLastLesson && completedQuiz) {
        btn.style.display = '';
    } else {
        btn.style.display = 'none';
    }
    if(currLevel >= progression[currCategory] && !previewMode && completedQuiz) {
        updateProgression(currCategory, currLevel+1);
    }
    if(dataSet[progression["language"]]["categories"][currCategory][currLevel]["quiz"].length) {
        showBtn.style.display = '';
    } else {
        showBtn.style.display = 'none';
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
            element = document.createElement("div");
            let img = document.createElement("img");
            let s = ""
            i++;
            while(string[i] !== '\n' && i < string.length) {
                s += string[i];
                i++;
            }
            img.src = s;
            element.append(img);
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
            i++;
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
        "content" : content.trim() === '' ? "# Blank introduction" : content,
        "lesson" : lesson.trim() === '' ? "# Blank lesson" : lesson,
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
        console.log(editMode)
        if(editMode) {
            console.log(editCategory);
            dataSet["en"]["categories"][editCategory].forEach((ele, i) => {
                if(ele.title === editTitle) {
                    dataSet["en"]["categories"][editCategory][i] = obj;
                    saveData(dataSet);
                    editMode = false;
                    moveToLesson(editCategory, dataSet, 'r');
                }
            })
        } else {
            dataSet["en"]["categories"][cat].push(obj);
            saveData(dataSet);
            moveToLesson(cat, dataSet, 'r');
            resetAreas();
        }
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

function resetAreas() {
    document.getElementById("chooseCategory").value = "html";
    document.getElementById("chooseTitle").value = "";
    document.getElementById("contentArea").value = "";
    document.getElementById("lessonArea").value = "";
}

function lessonsReturnHandler() {
    if(previewMode || editMode) {
        openTab("finalCreator", 'l');
        previewMode = false;
        editMode = false;
    } else {
        openTab("categories", 'l');
    }
}

function cancelAdding() {
    openTab("home", 'l');
    resetAreas();
}

function catDeleteChangehandler() {
    let cat = document.getElementById("chooseCategoryDelete").value;
    console.log(cat);
    console.log(dataSet);
    let lessons = dataSet[progression["language"]]["categories"][cat].map(ele => ele.title);
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
    if(!editMode) {
        dataSet[progression["language"]]["categories"][cat] = dataSet[progression["language"]]["categories"][cat].filter(ele => ele.title !== lesson);
        saveData(dataSet);
        openTab("home", 'l');
    } else {
        resetAreas();
        let less = dataSet[progression["language"]]["categories"][cat].filter(ele => ele.title === lesson)[0];
        document.getElementById("chooseCategory").value = cat;
        document.getElementById("chooseTitle").value = less["title"];
        document.getElementById("contentArea").value = less["content"];
        document.getElementById("lessonArea").value = less["lesson"];
        clearQuestions();
        document.getElementById("allQuestions").replaceChildren();
        less["quiz"].forEach(ele => {
            addQuestionElement(ele["question"], ele["options"][ele["correctAnswer"]], ele["options"]);
        })
        openTab('titleCreator', 'r');
        editCategory = cat;
        editTitle = lesson;
    }
}

function removeLesson() {
    document.getElementById("removeLessonTxt").textContent = "What lesson to remove?";
    document.getElementById("removeCategoryTxt").textContent = "Remove lesson from what category?";
    document.getElementById("rmvBtn").textContent = "Remove";
    openTab('removeLesson', 'r');
}

function editLesson() {
    document.getElementById("removeLessonTxt").textContent = "What lesson to edit?";
    document.getElementById("removeCategoryTxt").textContent = "Edit lesson from what category?";
    document.getElementById("rmvBtn").textContent = "Edit";
    openTab('removeLesson', 'r');
    editMode = true;
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
    let question = document.getElementById("addQuestionInput").value;
    let answersElements = document.getElementById("answersList");
    let correctAnswer = document.getElementById("selectCorrectAnswer").value;
    let answers = Array.from(answersElements.children).map(e => e.textContent.replace("Remove", ""));
    clearQuestions();
    addQuestionElement(question, correctAnswer, answers);
}

function clearQuestions() {
    document.getElementById("addAnswerInput").value = "";
    document.getElementById("addQuestionInput").value = "";
    document.getElementById("answersList").replaceChildren();
    document.getElementById("selectCorrectAnswer").replaceChildren();
}

function addQuestionElement(question, correct, answers) {
    let questionContainer = document.createElement("div");
    let questionText = document.createElement("h3");
    let answersContainer = document.createElement("ul")
    answersContainer.classList.add("addedUl");
    let correctAnswerText = document.createElement("h3");
    let removeButton = document.createElement("button");
    removeButton.classList.add("addedBtn");

    questionText.textContent = "Question: " + question;
    questionText.classList.add("addedQuestion");
    answers.forEach(answer => {
        let li = document.createElement("li");
        li.textContent = answer;
        li.classList.add("addedAnswer");
        answersContainer.append(li);
    })

    correctAnswerText.textContent = "Answer: " + correct;
    correctAnswerText.classList.add("addedCorrect");
    removeButton.textContent = "Remove";
    questionContainer.append(questionText, answersContainer, correctAnswerText, removeButton);
    questionContainer.classList.add("qContainer");
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

    //username
    document.getElementById("profileUsername").textContent = progression["username"];

    let categs = ["html", "css", "js", "python", "c", "cpp"];
    let achs = ["giga", "crazy", "designer", "doom"];
    let completed = 0;
    categs.forEach(cat => {
        let bar = document.querySelector(`#${cat}Line`);
        let perc = document.querySelector(`#${cat}Perc`);
        let total = dataSet[progression["language"]]["categories"][cat].length;
        let done = progression[cat];
        let percentage = total ? Math.floor(done*100/total) : 0;
        if(percentage > 100) percentage = 100;
        bar.style.background = `linear-gradient(to right, rgb(219, 176, 56) ${percentage}%, rgb(153, 153, 153) ${1 - percentage}%)`;
        perc.textContent = percentage+"%";
        if(progression[`${cat}Done`]) {
            document.getElementById(`${cat}Img`).src = "./assets/images/treasureOpen.png"
            completed++;
        } else {
            document.getElementById(`${cat}Img`).src = "./assets/images/treasure.png"
            if(percentage >= 100) {
                document.getElementById(`${cat}Stat`).classList.add("canClaim");
                document.getElementById(`${cat}Img`).classList.add("shake");
                completed++;
            }
        }
    })
    updateAch("doom", completed);
    achs.forEach(ach => {
        updateAch(ach, progression[ach]["value"]);
    })
    updateAch("designer", progression["css"]);
    updateDiamonds();
    updateHearts();
    openTab("profile", 'r');
}

function claim(s) {
    let total = dataSet[progression["language"]]["categories"][s].length;
    let done = progression[s];
    if(progression[s+"Done"] || done < total || total === 0) return;
    document.getElementById(s+"Stat").classList.remove("canClaim");
    document.getElementById(s+"Img").classList.remove("shake");
    document.getElementById(s+"Img").src = "./assets/images/treasureOpen.png";
    progression[s+"Done"] = true;
    updateDiamonds(progression["diamonds"]+300);
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
    if(currLevel+1 >= dataSet[progression["language"]]["categories"][currCategory].length) return;
    currLevel++;
openContent(dataSet[progression["language"]]["categories"][currCategory][currLevel], 'r');
numberOfQuestions = dataSet[progression["language"]]["categories"][currCategory][currLevel]["quiz"].length;
}

function playSound(soundPath) {
    if(!soundOn || muted) return;
    var audio = new Audio(soundPath);
    audio.play();
}

function mute() {
    muted = true;
}

function unMute() {
    muted = false;
}

function goToStartQuiz(dir) {
    if(numberOfQuestions) {
        openTab("quiz", dir);
    } else {
        showResults();
    }
}

function backToLessons() {
    if(previewMode) {
        openTab("lessons", 'l');
    } else {
        moveToLesson(currCategory, dataSet, 'l');
    }
}

function updateDiamonds(count, silent) {
    if(count === undefined) {
        updateDiamonds(progression["diamonds"], true);
        return;
    }
    if(!silent) {
        let diff = count - progression["diamonds"];
        let lang = progression["language"];
        let thingo = '';
        if(lang === 'ru') {
            thingo = 'бриллианты';
        } else if(lang === 'ro') {
            thingo = 'diamante';
        } else {
            thingo = 'diamonds';
        }
        if(diff>0) updateAch("giga", progression["giga"]["value"]+diff);
        notify((diff > 0 ? "+"+diff : diff) + " " + thingo, "./assets/images/diamands.png");
    }
    updateProgression("diamonds", count);
    let profileDiamonds = document.getElementById("diamondsCount")
    profileDiamonds.textContent = count;
}

function updateAch(ach, value) {
    let total = progression[ach]["total"];
    let claimed = progression[ach]["claimed"];
    if(value > total) value = total;
    let obj = {
        "value": value,
        "total": total,
        "claimed": claimed,
    }
    updateProgression(ach, obj);
    let ele = document.querySelector("#" + ach + "Progress");
    let bar = document.querySelector("#" + ach + "Bar");
    ele.textContent = value + "/" + total;
    console.log(value);
    let per = Math.floor(value/total*100);
    bar.setAttribute("style", `background: linear-gradient(to right, rgb(59, 181, 59) ${per}%, rgb(157, 157, 157) 0%);`);
    if(value === total) {
        console.log("OMGOMGOGM")
        let box = document.querySelector("#"+ach+"Cont");
        if(!progression[ach]["claimed"]) {
            box.classList.add("shake2");
            box.style.backgroundColor = "yellow";
            box.addEventListener("click", e => {
                if(progression[ach]["claimed"]) return;
                updateDiamonds(progression["diamonds"]+500);
                updateProgression(ach, {
                    "value": progression[ach]["value"],
                    "total": progression[ach]["total"],
                    "claimed": true,
                });
                box.classList.remove("shake2");
                box.style.backgroundColor = "green";
            })
        } else {
            box.style.backgroundColor = "green";
        }
    }
}

function updateHearts(count, silent) {
    if(count === undefined) {
        updateHearts(progression["hearts"], true);
        return;
    }
    if(!silent) {
        let diff = count - progression["hearts"];
        let lang = progression["language"];
        let thingo = '';
        if(lang === 'ru') {
            thingo = 'сердца';
        } else if(lang === 'ro') {
            thingo = 'inimile';
        } else {
            thingo = 'hearts';
        }
        notify((diff > 0 ? "+"+diff : diff) + " " + thingo, "./assets/images/heart.png");
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
        img.src = imgPath;
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
        questions = dataSet[progression["language"]]["categories"][currCategory][currLevel]["quiz"];
    }
    questions.forEach(ele => {
        let answerDiv = document.createElement("div");
        answerDiv.classList.add("answersAnswer");
        let question = document.createElement("h2");
        question.classList.add("answersQuestion");
        let answer = document.createElement("h2");
        answer.classList.add("answersCorrect");
        question.textContent = ele["question"];
        answer.textContent = "Answer: " + ele["options"][+ele["correctAnswer"]];
        answerDiv.append(question, answer);
        answersContainer.append(answerDiv);
    });
}

function toggleSoundEffects() {
    soundOn = !soundOn;
    updateProgression("soundOn", soundOn);
    if(soundOn) {
        document.getElementById("soundOff").style.display = 'none';
        document.getElementById("soundOn").style.display = 'inherit';
    } else {
        document.getElementById("soundOn").style.display = 'none';
        document.getElementById("soundOff").style.display = 'inherit';
    }
}

function toggleSwipe() {
    swipeOn = !swipeOn;
    updateProgression("swipeOn", swipeOn);
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

function loadSettings() {
    if(progression["soundOn"] !== soundOn) {
        toggleSoundEffects();
    }
    if(progression["swipeOn"] !== swipeOn) {
        toggleSwipe();
    }
    setActiveLanguage(progression["language"]);
}

function goLeft() {
    if(!swipeOn) return;
    if(currentTab === 'home') {
        openTab("settings", 'l');
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

function register() {
    let username = document.getElementById("usernameInput").value;
    let password = document.getElementById("passwordInput").value;
    if(username.trim() === "") {
        let lang = progression["language"];
        let thingo = '';
        if(lang === 'ru') {
            thingo = 'Пожалуйста введите имя пользователя';
        } else if(lang === 'ro') {
            thingo = 'Va rugam sa introduceti un username';
        } else {
            thingo = 'Please enter a username';
        }
        notify(thingo);
        return;
    } else if(password.trim() === "") {
        let lang = progression["language"];
        let thingo = '';
        if(lang === 'ru') {
            thingo = 'Пожалуйста, введите пароль';
        } else if(lang === 'ro') {
            thingo = 'Vă rugăm să introduceți o parolă';
        } else {
            thingo = 'Please enter a password';
        }
        notify(thingo);
        return;
    }
    updateProgression("username", username);
    document.getElementById("profileUsername").textContent = username;
    localStorage.setItem("registered", true);
    openTab("home");
}

function logOut() {
    openTab("register", 'l');
    localStorage.removeItem("registered");
}

function heartsGenerator(seconds) {
    setInterval(_=>{
        updateHearts(progression["hearts"]+1);
    }, seconds*1000)
}

function total(cat) {
    return dataSet["en"]["categories"][cat].length;
}

function shopSetUp() {
    document.querySelector("#heart1").addEventListener("click", _ => {
       buyHearts(1, 100); 
    })
    document.querySelector("#heart5").addEventListener("click", _ => {
        buyHearts(5, 400); 
    })  
    document.querySelector("#heart10").addEventListener("click", _ => {
        buyHearts(10, 700);
    })
    document.querySelector("#diamondBoostBtn").addEventListener("click", _ => {
        if(boosted) {
            notify("You already have a boost on!");
            return;
        }
        buy(500, _=>{
            boosted = true;
            notify("2x boost applied!");
            setTimeout(() => {
                boosted = false;
                notify("2x boost expired!");
            }, 1000*60*60);
        })
    })

    for (const [key, value] of Object.entries(progression["skins"])) {
        if(value) {
            unlockCursor(key);
        }
    }

    [1,2,3,4].forEach( n => {
        document.querySelector("#cursorMouse"+n).addEventListener("click", _ => {
            if(!progression["skins"]["cursorMouse"+n]) {
                buy(1000, _=>{
                    progression["skins"]["cursorMouse"+n] = true;
                })
            }
            if(progression["skins"]["cursorMouse"+n]) {
                document.body.style.cursor = `url('./assets/images/cursorMouse${n}.png'), auto`;
                unlockCursor("cursorMouse"+n);
            }
        })
    })
    document.querySelector("#cursorMouse5").addEventListener('click', () => {
        document.body.style.cursor = "auto";
    })
}

function buy(cost, callback) {
    if(progression["diamonds"] < cost) {
        notify("Not enough diamonds!", "./assets/images/diamands.png", 1500);
        return;
    }
    canBuy = false;
    updateDiamonds(progression["diamonds"]-cost);
    setTimeout(() => {
        callback();
        canBuy = true
    }, 1500);
}

function buyHearts(num, cost) {
    buy(cost, _=>{
        updateHearts(progression["hearts"]+num);
    });
}

function unlockAllLessons() {
    let cats = ["html", "css", "js", "c", "cpp", "python"];
    cats.forEach(ele=>{
        updateProgression(ele, 100);
    })
}

function manyHearts() {
    updateHearts(9999);
}

function manyDiamonds() {
    updateDiamonds(9999);
}

function unlockCursor(cursor) {
    let ele = document.querySelector("#"+cursor);
    ele.textContent = "Use";
}

window.unlockAllLessons = unlockAllLessons;
window.manyDiamonds = manyDiamonds;
window.manyHearts = manyHearts;
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
window.updateProgression = updateProgression;
window.register = register;
window.logOut = logOut;
window.claim = claim;
window.editLesson = editLesson;
window.removeLesson = removeLesson;
window.editMode = editMode;

export { shopSetUp, progression, heartsGenerator, openTab, fetchData, getData, loadProgression, currentTab, offlineMode, mute, unMute, updateDiamonds, updateHearts, goRight, goLeft, removeAllEventListeners, loadSettings};