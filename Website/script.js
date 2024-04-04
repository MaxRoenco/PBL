let dataSet = {};
let language = 'en';
let soundOn = true;
let currentTab = "home";
let questionIndex = 0;
let correct = 0;
let previewMode = false;

function openTab(tabName, dir) {
    let buttons = [
        {id: "settingsIcon", tab: "home"}, 
        {id: "profileIcon", tab: "home"}, 
        {id: "categoriesReturn", tab: "categories"}, 
        {id: "lessonsReturn", tab: "lessons"},
        {id: "createBtn", tab: "home"},
    ]

    buttons.forEach(ele => {
        if(tabName === ele.tab) {
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
}

async function fetchData() {
    try {
        const response = await fetch('test.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        dataSet = data;
        window.dataSet = dataSet;
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

function moveToLesson(lessonName, data) {
    openTab("lessons", 'r');
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
        lessonContentSpan.textContent = ele["title"];
        container.append(lessonElement);
        lessonElement.append(lessonNumSpan);
        lessonElement.append(newLine);
        lessonElement.append(lessonContentSpan);

        lessonElement.addEventListener("click", _ => {
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
        opt.classList.add("button", "option");
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
    language = lang;
    let langs = ['en', 'ru', 'ro'];
    langs.forEach( ele => {
        if(lang == ele) {
            document.getElementById(ele).classList.add("active");
        } else {
            document.getElementById(ele).classList.remove("active");
        }
    })
}

function showResults(total) {
    document.getElementById("resultsElement").textContent = "You got " + correct + '/' + total + " correct";
    openTab("results", 'r');
}

function toggleSoundEffects() {
    soundOn = !soundOn;
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
        console.log(string[i])
    }
}

function removeAllEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.parentNode.replaceChild(clonedElement, element);
    return clonedElement;
}

function startCreating() {
    let cat = "";
    let obj = {
        "title" : "",
        "content" : "",
        "lesson" : "",
    }
    openTab("titleCreator", 'r');
    let catField = document.getElementById("chooseCategory");
    let titField = document.getElementById("chooseTitle");
    titField.value = "";
    let nextBtn = document.getElementById("titleBtn");
    nextBtn = removeAllEventListeners(nextBtn);
    nextBtn.addEventListener("click", _ => {
        cat = catField.value;
        obj.title = titField.value;
        contentCreate(cat, obj);
    })
}

function contentCreate(cat, obj) {
    openTab("contentCreator", "r");
    let textArea = document.getElementById("contentArea");
    let nextBtn = document.getElementById("contentBtn");
    nextBtn = removeAllEventListeners(nextBtn);
    nextBtn.addEventListener("click", _ => {
        obj.content = textArea.value;
        lessonCreate(cat, obj);
    })
}

function lessonCreate(cat, obj) {
    openTab("lessonCreator", "r");
    let textArea = document.getElementById("lessonArea");
    let nextBtn = document.getElementById("lessonBtn");
    nextBtn = removeAllEventListeners(nextBtn);
    let addBtn = document.getElementById("addBtn");
    addBtn = removeAllEventListeners(addBtn);
    nextBtn.addEventListener("click", _ => {
        obj.lesson = textArea.value;
        let previewObj = {
            "en": {
                "categories": {
                }
            }
        }
        previewObj["en"]["categories"][cat] = [obj];
        console.log(cat, previewObj)
        moveToLesson(cat, previewObj);
        previewMode = true;
    })
    addBtn.addEventListener("click", _ => {
        moveToLesson(cat, dataSet);
    })
}

function lessonsReturnHandler() {
    if(previewMode) {
        openTab("lessonCreator", 'l');
        previewMode = false;
    } else {
        openTab("categories", 'l');
    }
}

window.openTab = openTab;
window.moveToLesson = moveToLesson;
window.setActiveLanguage = setActiveLanguage;
window.toggleSoundEffects = toggleSoundEffects;
window.lessonsReturnHandler = lessonsReturnHandler;
window.dataSet = dataSet;

export { openTab, fetchData, startCreating };
