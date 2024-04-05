import { openTab, getData, loadProgression, currentTab, offlineMode, mute, unMute } from './script.js';

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
  
