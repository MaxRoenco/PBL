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
        saveData(dataSet);
        catDeleteChangehandler();
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
    }
}

function removeAllEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.parentNode.replaceChild(clonedElement, element);
    return clonedElement;
}

function createLesson() {
    openTab("finalCreator", "r");
    let cat = document.getElementById("chooseCategory").value;
    let obj = {
        "title" : document.getElementById("chooseTitle").value,
        "content" : document.getElementById("contentArea").value,
        "lesson" : document.getElementById("lessonArea").value,
    }
    let addBtn = document.getElementById("addBtn");
    addBtn = removeAllEventListeners(addBtn);
    let previewBtn = document.getElementById("previewBtn");
    previewBtn = removeAllEventListeners(previewBtn);

    previewBtn.addEventListener("click", _ => {
        let previewObj = {"en": {"categories": {}}}
        previewObj["en"]["categories"][cat] = [obj];
        moveToLesson(cat, previewObj);
        previewMode = true;
    })
    addBtn.addEventListener("click", _ => {
        dataSet["en"]["categories"][cat].push(obj);
        saveData(dataSet);
        moveToLesson(cat, dataSet);
    })
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
    lessons.forEach((ele, i) => {
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

function openRemoveTab() {
    catDeleteChangehandler();
    openTab("removeLesson", 'r');
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


    console.log(question, answers, correctAnswer)

    let questionContainer = document.createElement("div");
    let questionText = document.createElement("h3");
    let answersContainer = document.createElement("ul")
    let correctAnswerText = document.createElement("h3");

    questionText.textContent = "Question: " + question.value;
    answers.forEach(answer => {
        let li = document.createElement("li");
        li.textContent = answer;
        answersContainer.append(li);
    })
    correctAnswerText.textContent = "Answer: " + correctAnswer;

    questionContainer.append(questionText, answersContainer, correctAnswerText);
    questionContainer.classList.add("qContainer");
    question.value = ""
    answersElements.replaceChildren();
    document.getElementById("selectCorrectAnswer").replaceChildren();

    document.getElementById("allQuestions").append(questionContainer);


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
window.openRemoveTab = openRemoveTab;
window.fetchData = fetchData;
window.resetDataSet = resetDataSet;
window.copyJson = copyJson;
window.addAnswer = addAnswer;
window.addQuestion = addQuestion;
window.dataSet = dataSet;

export { openTab, fetchData, getData };