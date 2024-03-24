import { openTab, fetchData } from './script.js';

setTimeout(() => {
    document.body.style.opacity = "1";
}, 500);

openTab("main");
fetchData();