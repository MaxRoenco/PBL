let textArea = document.getElementById("textInput");
let button = document.getElementById("but");
let output = document.getElementById("or");
let copyButton = document.getElementById("copy");

button.addEventListener("click", e => {
    output.textContent = printText(textArea.value);
    compile(textArea.value, document.body);
})

copyButton.addEventListener("click", e => {
    copy(output.textContent);
})


function compile(string, parent) {
    let lines = string.split("\n");
    lines.forEach(line => {
        let sign = line[0];
        let element;
        if(sign === '#') {
            element = document.createElement("h1");
            element.textContent = line.slice(1);
        } else if(sign === '$') {
            element = document.createElement("img");
            element.src = line.slice(1);
        } else if(sign === '>' || sign === '\r' || line.length === 0) {
            element = document.createElement("br");
        } else if(sign === '\\') {
            element = document.createElement("p");
            element.textContent = line.slice(1);
        } else {
            element = document.createElement("p");
            element.textContent = line;
        }
        parent.append(element);
    });
}

function printText(string) {
    let result = "\"";
    for(let i = 0; i < string.length; i++) {
        if(string[i] === '\n') {
            result += "\\n";
        } else if(string[i] === '\r') {
            result += "\\r";
        } else {
            result += string[i];
        }
    }
    result += "\"";
    return result;
}

function copy(string) {
    navigator.clipboard.writeText(string)
    .then(() => {
        alert("String copied to clipboard: " + string);
    })
    .catch(err => {
        console.error('Failed to copy:', err);
    });
}