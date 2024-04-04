import { openTab, getData, loadProgression } from './script.js';

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

setActiveLanguage("en");
openTab("home");
getData();
loadProgression();
