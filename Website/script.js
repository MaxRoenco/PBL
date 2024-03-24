function main() {
    openTab("tab3");
    fetchData();
}

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

async function fetchData() {
    try {
        const response = await fetch('test.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

main();