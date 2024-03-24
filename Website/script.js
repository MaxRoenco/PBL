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
    dataSet["en"]["categories"][lessonName].forEach((ele, i) => {
        let lessonElement = document.createElement("div");
        lessonElement.classList.add("lesson");
        lessonElement.textContent = `Lesson ${i+1}: \n${ele}`
        container.append(lessonElement);
    })
}
window.moveToLesson = moveToLesson;

export { openTab, fetchData };
