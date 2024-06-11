import { openTab, getData, loadProgression, currentTab, offlineMode, mute, unMute, updateDiamonds, updateHearts, goRight, goLeft, loadSettings } from './script.js';
mute()
let oldTab = currentTab;
window.oldTab = oldTab;
let isRegistered = localStorage.getItem("registered") || false;

setTimeout(() => {
    document.body.style.opacity = "1";
}, 500);

let tabs = document.getElementById("tabs").children;
Array.from(tabs).forEach(ele => {
    ele.style.display = "none";
});

let buttons = [
    { id: "settingsIcon", tab: "home" },
    { id: "profileIcon", tab: "home" },
    { id: "categoriesReturn", tab: "categories" },
    { id: "lessonsReturn", tab: "lessons" },
    { id: "createBtn", tab: "home" },
]

buttons.forEach(ele => {
    document.getElementById(ele.id).classList.add("hidden");
})

if(isRegistered) {
    openTab("home");
} else {
    openTab("register")
}

getData();
loadProgression();
loadSettings();

window.addEventListener('load', () => {
    const status = navigator.onLine;
    if (!status && !offlineMode) {
        oldTab = currentTab;
        openTab("wifi", 'r');
    }
});

window.addEventListener('offline', (e) => {
    if (!offlineMode) {
        oldTab = currentTab;
        window.oldTab = oldTab;
        openTab("wifi", 'r');
    }
});

window.addEventListener('online', (e) => {
    if (!offlineMode) {
        openTab(oldTab, 'l');
    }
});

updateDiamonds();
updateHearts();

function trackDragDirection() {
    let isDragging = false;
    let hasDirectionBeenTriggered = false;
    let startX = null;
    let sensitivity = 200;

    document.addEventListener("mousedown", function (event) {
        isDragging = true;
        startX = event.pageX;
        hasDirectionBeenTriggered = false;
    });

    document.addEventListener("mousemove", function (event) {
        if (!isDragging || hasDirectionBeenTriggered) return;

        const currentX = event.pageX;
        const deltaX = currentX - startX;

        if (deltaX > sensitivity) {
            goLeft()
            hasDirectionBeenTriggered = true;
        } else if (deltaX < -sensitivity) {
            goRight()
            hasDirectionBeenTriggered = true;
        }
    });

    document.addEventListener("mouseup", function (event) {
        isDragging = false;
        startX = null;
        hasDirectionBeenTriggered = false;
    });
}
trackDragDirection();
unMute()


setInterval(_=>{
    updateHearts(progression["hearts"]+1);
}, 1000);


