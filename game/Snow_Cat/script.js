let bg = document.getElementById('background').getBoundingClientRect();
let cat = {
	h: 50,
	w: 60,
	x: Math.floor(bg.width/2 - 30),
	y: Math.floor(bg.height/2 - 25),
	elemHTML: document.getElementById('cat'),
	frame: 1,
	move: ()=>{
		cat.elemHTML.style.left = cat.x + "px";
		cat.elemHTML.style.top = cat.y + "px";
	}
}

let keyPressed = {};
document.addEventListener('keydown', (e) => {
	keyPressed[e.code] = true;
});
document.addEventListener('keyup', (e) => {
	keyPressed[e.code] = false;
});
function processKey() {
 	cat.frame = (cat.frame == 1) ? 2 : 1;
	if(keyPressed['ArrowUp'] && cat.y > 0){
		cat.y -= 25;
		cat.elemHTML.style.backgroundImage = "url('img/arriba"+cat.frame+".png')";
	}else if(keyPressed['ArrowDown'] && cat.y < bg.height - cat.h){
		cat.y += 25;
		cat.elemHTML.style.backgroundImage = "url('img/abajo"+cat.frame+".png')";
	}
	if(keyPressed['ArrowLeft'] && cat.x > 0){
		cat.x -= 25;
		cat.elemHTML.style.backgroundImage = "url('img/izq"+cat.frame+".png')";
	}else if(keyPressed['ArrowRight'] && cat.x < bg.width - cat.w){
		cat.x += 25;
		cat.elemHTML.style.backgroundImage = "url('img/der"+cat.frame+".png')";
	}
	cat.move();
}

cat.move();
let gameLoop = setInterval(() => {
	processKey();
}, 150);