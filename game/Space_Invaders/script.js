let shoots = [];
let shootCount = 0;
let space = document.getElementById('space').getBoundingClientRect();
let aliens = [
	{id: 0, name: "tie_fighter", left: 50, top: 0},
	{id: 1, name: "tie_fighter", left: 150, top: 80},
	{id: 2, name: "tie_fighter", left: 350, top: 40},
	{id: 3, name: "tie_fighter", left: 450, top: 60},
	{id: 4, name: "tie_fighter", left: 600, top: 100},
	{id: 5, name: "tie_fighter", left: 750, top: 5},
];
let score = 0;
let aliensCount = 6;
let generateAlien = setInterval(() => {
	let alien = {
		id: aliensCount,
		name: "tie_fighter",
		left: Math.floor(Math.random() * (space.width-sizeTable['tie_fighter'].w - 50)) + 50,
		top: -50
	};
	aliens.push(alien);
	aliensCount++;
	document.getElementById("aliens").innerHTML += /*html*/
	`<div class='tie_fighter n-${alien.id}' style='left:${alien.left}px; top:${alien.top}px'></div>`;
}, 7000);
const sizeTable = {
	'MileniumFalcon': {w: 110, h:140},
	'tie_fighter': {w: 40, h: 40},
	'destroyer': {w: 200, h:400},
	'shoot': {w: 6, h: 28}
}
let ship = {
	name: 'MileniumFalcon',
	left: space.width/2-60,
	top: space.height-140
};
let life = 10;
let heart = document.querySelectorAll('#life .heart');
let scoreDiv = document.querySelector('#score');

function detectarColision(obj1, obj2) {
	return !(
		obj1.top > obj2.top+sizeTable[obj2.name].h ||
		obj1.left+sizeTable[obj1.name].w < obj2.left ||
		obj1.top+sizeTable[obj1.name].h < obj2.top ||
		obj1.left > obj2.left+sizeTable[obj2.name].w
	);
}
function moveShip(){
	document.getElementById("ship").style.left = ship.left + "px";
	document.getElementById("ship").style.top = ship.top + "px";
	if(aliens.some(alien => detectarColision(alien, ship))){
		life--;
		heart[0].style.width = life*4+"px";
		if(life <= 0){
			life = 10;
			heart[0].remove();
			heart = document.querySelectorAll('#life .heart');
		}
	}
}
function drawAliens(){
	document.getElementById("aliens").innerHTML = aliens.map((alien) => (
		/*html*/`<div class='${alien.name} n-${alien.id}' style='left:${alien.left}px; top:${alien.top}px'></div>`
	)).join('');
}
function drawShoot(){
	let shoot = {id:shootCount, name:'shoot', left:ship.left+55, top:ship.top+50};
	shoots.push(shoot);
	document.getElementById("shoots").innerHTML += /*html*/ `
	<div class='shoot n-${shoot.id}'  style='left:${shoot.left}px; top:${shoot.top}px'></div>`;
	shootCount++;
}
function moveAliens(){
	aliens.forEach((alien, index) => {
		let alienDiv = document.querySelector(`.${alien.name}.n-${alien.id}`);

		if(alien.top < space.height) {
			alien.top = alien.top + 15;
			alienDiv.style.top = alien.top + "px";

			if(shoots.length){
				shoots.forEach((shoot, shootNro) => {
					if(detectarColision(alien, shoot)) {
						if (alienDiv) {
							alienDiv.classList.add('explosion');
							setTimeout(() => {
								alienDiv.remove();
							}, 700);
						}
						score++;
						scoreDiv.textContent = "×"+score;
						aliens.splice(index, 1);
						shoots.splice(shootNro, 1);
						document.querySelector(`.shoot.n-${shoot.id}`).remove();
					}
				})
			}
		}else{
			alien.top = 0;
		}
	});
}
function moveShoots(){
	shoots.forEach(shoot => {
		if(shoot.top > -28) {
			shoot.top = shoot.top - 28;
			document.querySelector(`.shoot.n-${shoot.id}`).style.top = shoot.top + "px";
		}else{
			shoots.shift();
			document.querySelector(`.shoot.n-${shoot.id}`).remove();
		}
	});
}

let keyPressed = {};
document.addEventListener('keydown', (e) => {
    keyPressed[e.code] = true;
});
document.addEventListener('keyup', (e) => {
    keyPressed[e.code] = false;
});
function procesarControles() {
    if(keyPressed['ArrowLeft'] && ship.left > 0){
        ship.left -= 20;
    }else if(keyPressed['ArrowRight'] && ship.left < space.width-sizeTable['MileniumFalcon'].w){
        ship.left += 20;
    }
    if(keyPressed['ArrowUp'] && ship.top > space.height*2/3){
        ship.top -= 10;
    }else if(keyPressed['ArrowDown'] && ship.top < space.height-sizeTable['MileniumFalcon'].h){
        ship.top += 20;
    }
	if(keyPressed['KeyD']){
		document.querySelector("body").classList.toggle("devMode");
	}
    if(keyPressed['Space']) {
        drawShoot();
        keyPressed['Space'] = false;
    }
    moveShip();
}

drawAliens();
moveShip();
let gameCicle = setInterval(() => {
    procesarControles();
	moveAliens();
	moveShoots();
	if(heart.length == 0) {
		clearInterval(gameCicle);
		clearInterval(generateAlien);
		console.log("game over");
	}
}, 100);
