let textArea = document.getElementById("textInput");
let button = document.getElementById("but");
let output = document.getElementById("or");
let copyButton = document.getElementById("copy");

button.addEventListener("click", e => {
    output.textContent = printText(textArea.value);
    let parent = document.getElementById("preview");
    parent.replaceChildren();
    compile(textArea.value, parent);
})

copyButton.addEventListener("click", e => {
    copy(output.textContent);
})


function compile(string, parent) {
    string += '\n';
    let i = 0;  
    while(i < string.length)
    {
        let element;
        if(string[i] === '#' && string[i+1] === "#") {
            element = document.createElement("h2");
            i+=2;
            while(string[i] !== '\n' && i < string.length) {
                element.textContent += string[i];
                i++;
            }
        } else if(string[i] === '#') {
            element = document.createElement("h1");
            i++;
            while(string[i] !== '\n' && i < string.length) {
                element.textContent += string[i];
                i++;
            }
        } else if(string[i] === '$') {
            element = document.createElement("img");
            i++;
            while(string[i] !== '\n' && i < string.length) {
                element.src += string[i];
                i++;
            }
        } else if(string[i] === '>' || string[i] === '\r' || string[i] === '\n') {
            element = document.createElement("br");
            i++;
        } else if(string[i] === '\\') {
            element = document.createElement("p");
            i++;
            while(string[i] !== '\n' && i < string.length) {
                element.textContent += string[i];
                i++;
            }
        } else if(string[i] === '`') {
            element = document.createElement("code");
            element.setAttribute('style', 'white-space: pre;');
            i++;
            while(string[i] !== '`' && i < string.length) {
                if(string[i] === '\n') {
                    element.textContent += '\n\r';
                } else {
                    element.textContent += string[i];
                }
                i++;
            }
        } else {
            element = document.createElement("p");
            while(string[i] !== '\n' && i < string.length) {
                element.textContent += string[i];
                i++
            }
        }
        parent.append(element);
        console.log(string[i])
    }
}

function printText(string) {
    let result = "\"";
    for(let i = 0; i < string.length; i++) {
        if(string[i] === '\n') {
            result += "\\n";
        } else if(string[i] === '\r') {
            result += "\\r";
        } else if(string[i] === '\"') {
            result += "\\\"";
        } else if(string[i] === '\'') {
            result += "\\\'";
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