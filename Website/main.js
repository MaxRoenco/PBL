import { openTab, getData, loadProgression, currentTab, offlineMode, mute, unMute, updateDiamonds, updateHearts, goRight, goLeft } from './script.js';

let oldTab = currentTab;
window.oldTab = oldTab;

setTimeout(() => {
    document.body.style.opacity = "1";
}, 500);


let tabs = document.getElementById("tabs").children;
Array.from(tabs).forEach(ele => {
    ele.style.display = "none";
});

let buttons = [
    {id: "settingsIcon", tab: "home"}, 
    {id: "profileIcon", tab: "home"},
    {id: "categoriesReturn", tab: "categories"}, 
    {id: "lessonsReturn", tab: "lessons"},
    {id: "createBtn", tab: "home"},
]

buttons.forEach(ele => {
        document.getElementById(ele.id).classList.add("hidden");
})

mute();
setActiveLanguage("en");
openTab("home");
getData();
loadProgression();
unMute();

window.addEventListener('load', () => {
    const status = navigator.onLine;
    if(!status && !offlineMode) {
        oldTab = currentTab;
        openTab("wifi", 'r');
    }
});

window.addEventListener('offline', (e) => {
    if(!offlineMode) {
        oldTab = currentTab;
        window.oldTab = oldTab;
        openTab("wifi", 'r');
    }
});
  
window.addEventListener('online', (e) => {
    if(!offlineMode) {
        openTab(oldTab, 'l');
    }
});

updateDiamonds();
updateHearts();

// let canScroll = true;
// window.addEventListener("wheel", function(event) {
//     if(!canScroll) return;
//     if (event.deltaX > 0) {
//         console.log("right")
//         goRight();
//     } else if (event.deltaX < 0) {
//         console.log("left")
//         goLeft();
//     }
//     canScroll = false;
//     setTimeout(_ => {
//         canScroll = true;
//     }, 2000);
// });
function trackDragDirection() {
    let isDragging = false;
    let hasDirectionBeenTriggered = false;
    let startX = null;

    document.addEventListener("mousedown", function(event) {
        isDragging = true;
        startX = event.pageX;
        hasDirectionBeenTriggered = false;
    });

    document.addEventListener("mousemove", function(event) {
        if (!isDragging || hasDirectionBeenTriggered) return;

        const currentX = event.pageX;
        const deltaX = currentX - startX;

        if (deltaX > 0) {
            goLeft()
            hasDirectionBeenTriggered = true;
        } else if (deltaX < 0) {
            goRight()
            hasDirectionBeenTriggered = true;
        }
    });

    document.addEventListener("mouseup", function(event) {
        isDragging = false;
        startX = null;
        hasDirectionBeenTriggered = false;
    });
}
trackDragDirection();

