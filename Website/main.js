import { openTab, fetchData } from './script.js';

setTimeout(() => {
    document.body.style.opacity = "1";
}, 500);


let tabs = document.getElementById("tabs").children;
Array.from(tabs).forEach(ele => {
    ele.style.display = "none";
});
let settingsButton = document.getElementById("settingsIcon");
let profileButton = document.getElementById("profileIcon");
let categoriesButton = document.getElementById("categoriesReturn");
let lessonsButton = document.getElementById("lessonsReturn");
settingsButton.style.display = "hidden";
profileButton.style.display = "hidden";
categoriesButton.style.display = "hidden";
lessonsButton.style.display = "hidden";
console.log("ran once")
openTab("home");
fetchData();
