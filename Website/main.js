import { openTab, fetchData } from './script.js';

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
    {id: "lessonsReturn", tab: "lessons"}
]

buttons.forEach(ele => {
        document.getElementById(ele.id).classList.add("hidden");
})

openTab("home");
setActiveLanguage("en");
fetchData();
