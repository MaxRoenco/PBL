let holster = document.querySelector('.holster');
let hearts = document.getElementById('hearts');
let diamonds = document.getElementById('diamonds');
let mouseSkins = document.getElementById('mouseSkins');
let holsterDiamonds = document.querySelector('.holsterDiamonds');
let holsterHearts = document.querySelector('.holsterHearts');

mouseSkins.addEventListener('click', () => {
    holster.style.display = 'flex';
    holsterDiamonds.style.display = 'none';
    holsterHearts.style.display = 'none';
})

diamonds.addEventListener('click', () => {
    holsterDiamonds.style.display = 'flex';
    holster.style.display = 'none';
    holsterHearts.style.display = 'none';
})

hearts.addEventListener('click', () => {
    holsterHearts.style.display = 'flex';
    holsterDiamonds.style.display = 'none';
    holster.style.display = 'none';
})


let cursorMouse1 = document.getElementById('cursorMouse1');
let cursorMouse2 = document.getElementById('cursorMouse2');
let cursorMouse3 = document.getElementById('cursorMouse3');
let cursorMouse4 = document.getElementById('cursorMouse4');
let cursorMouse5 = document.getElementById('cursorMouse5');

cursorMouse1.addEventListener('click', () => {
    document.body.style.cursor = "url('./assets/images/mouse6.png'), auto";
})

cursorMouse2.addEventListener('click', () => {
    document.body.style.cursor = "url('./assets/images/mouse5.png'), auto";
})

cursorMouse3.addEventListener('click', () => {
    document.body.style.cursor = "url('./assets/images/mouse3.png'), auto";
})

cursorMouse4.addEventListener('click', () => {
    document.body.style.cursor = "url('./assets/images/mouse4.png'), auto";
})

cursorMouse5.addEventListener('click', () => {
    document.body.style.cursor = "auto";
})