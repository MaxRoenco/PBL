let dataSet = {};
let language = 'en';
let soundOn = true;
let currentTab = "home";

function openTab(tabName, dir) {
    let buttons = [
        {id: "settingsIcon", tab: "home"}, 
        {id: "profileIcon", tab: "home"}, 
        {id: "categoriesReturn", tab: "categories"}, 
        {id: "lessonsReturn", tab: "lessons"}
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
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

function moveToLesson(lessonName) {
    openTab("lessons", 'r');
    let container = document.getElementById("lessons");
    container.replaceChildren();
    dataSet["en"]["categories"][lessonName].forEach((ele, i) => {
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
    let lines = string.split("\n");
    lines.forEach(line => {
        let sign = line[0];
        let sign2 = line[1];
        let element;
        if(sign === '#' && sign2 === "#") {
            element = document.createElement("h2");
            element.textContent = line.slice(2);
        } else if(sign === '#') {
            element = document.createElement("h1");
            element.textContent = line.slice(1);
        } else if(sign === '$') {
            element = document.createElement("img");
            element.src = line.slice(1);
        } else if(sign === '>' || sign === '\r' || line.length === 0) {
            element = document.createElement("br");
        } else if(sign === '\\') {
            element = document.createElement("p");
            element.textContent = line.slice(1);
        } else {
            element = document.createElement("p");
            element.textContent = line;
        }
        parent.append(element);
    });
}

function removeAllEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.parentNode.replaceChild(clonedElement, element);
    return clonedElement;
}

window.openTab = openTab;
window.moveToLesson = moveToLesson;
window.setActiveLanguage = setActiveLanguage;
window.toggleSoundEffects = toggleSoundEffects;

export { openTab, fetchData };
