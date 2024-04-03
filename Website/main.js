import { openTab, fetchData } from './script.js';

setTimeout(() => {
    document.body.style.opacity = "1";
}, 500);


let tabs = document.getElementById("tabs").children;
Array.from(tabs).forEach(ele => {
    ele.style.display = "none";
});
console.log("ran once")
openTab("home");
fetchData();
