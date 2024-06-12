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
