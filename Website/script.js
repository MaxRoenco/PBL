let dataSet = {};

function openTab(tabName) {
    let tabs = document.getElementById("tabs").children;
    Array.from(tabs).forEach(ele => {
        if (ele.getAttribute("data-tab") === tabName) {
            ele.style.display = "";
        } else {
            ele.style.display = "none";
        }
    });
}
window.openTab = openTab;

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
    openTab("lessons");
    let container = document.getElementById("lessons-container");
    container.replaceChildren(); // removes all children
    dataSet["en"]["categories"][lessonName].forEach((ele, i) => {
        let lessonElement = document.createElement("div");
        let lessonNumSpan = document.createElement("span");
        lessonNumSpan.textContent = `Lesson ${i+1}:`;
        lessonNumSpan.classList.add("lesson-span");
        lessonElement.classList.add("lesson");
        let newLine = document.createElement("br");
        let lessonContentSpan = document.createElement("span");
        lessonContentSpan.textContent = ele;
        container.append(lessonElement);
        lessonElement.append(lessonNumSpan);
        lessonElement.append(newLine);
        lessonElement.append(lessonContentSpan);
    })
}

function setActiveLanguage(lang) {
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
    
}

window.moveToLesson = moveToLesson;
window.setActiveLanguage = setActiveLanguage;

export { openTab, fetchData };
