function openTab(tabName) {
    let tabs = document.getElementById("tabs").children;
    Array.from(tabs).forEach(ele => {
        console.log(ele.getAttribute("data-tab") === tabName);
        if(ele.getAttribute("data-tab") === tabName) {
            ele.style.display = "";
        } else {
            ele.style.display = "none";
        }
    });
}

openTab("tab3");