function random(max,min){
	return Math.floor(Math.random()* (max-min +1))+min;
}
let game = {
	loop: null,
	init: ()=>{
		world.init();
		document.addEventListener('keydown',cat.move);
		game.loop = setInterval(() => {
			dog.move();
			if(cat.life === 0) 
				game.end("Game Over");
			if(score.value === score.max)
				game.end("You Win");
		}, 500);
	},
	end: (msj)=>{
		clearInterval(game.loop);
		document.removeEventListener('keydown',cat.move);
		document.querySelector('body').innerHTML = /*html*/ 
		`<h1>${msj}</h1><h2>Yout score ${score.value}</h2>
		<button id="retry" onCLick={world.reload()}>Play Again</button>`;
	}
}
let world = {
	map: [],
	blocks: {
		0: 'blank',
		1: 'pared',
		2: 'burguer',
		3: 'papitas',
	},
	init: ()=>{
		world.map = [
			[1,1,1,1,1,1,1,1,1,1],
			[1,0,random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),1],
			[1,random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),1],
			[1,random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),1],
			[1,random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),1],
			[1,random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),1],
			[1,random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),0,1],
			[1,random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),1],
			[1,random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),random(-1,4),1],
			[1,1,1,1,1,1,1,1,1,1]
		];
		let output = /*html*/`<div id='cat' style="top:${cat.y*40}px; left:${cat.x*40}px;"></div><div id='dog' style="top:${dog.y*40}px; left:${dog.x*40}px;"></div>`
		output+= world.map.map((row,rowNum)=>(/*html*/`
			<div class='fila'>
				${row.map((cell,cellNum)=>(/*html*/`<div id='cell-${rowNum}-${cellNum}' class='${world.blocks[cell]}'></div>`)).join('')}
			</div>
		`)).join('');
		document.getElementById('world').innerHTML = output;
		score.init();
		score.draw();
	},
	reload: ()=>{
		document.querySelector('body').innerHTML = `
		<div id='world'></div>
		<div class="score">
			<div id="vida">
				<span>Vida:</span>
				<img src="./img/heart.png" alt="" class="heart-3">
				<img src="./img/heart.png" alt="" class="heart-2">
				<img src="./img/heart.png" alt="" class="heart-1">
			</div>
			<div id="score-value">Score: 0</div>
		</div>`;
		cat.x=1; cat.y=1; cat.life=3;
		dog.x=2; dog.y=3;
		game.init();
	},
	update: (x, y)=>{
		document.getElementById(`cell-${y}-${x}`).className = world.blocks[0];
	}
};
let cat = {
	x: 1,
	y: 1,
	life: 3,
	eat: ()=>{
		if(world.map[cat.y][cat.x] === 2){
			world.map[cat.y][cat.x] = 0;
			score.value+=10;
			score.draw(score.value);
			world.update(cat.x, cat.y);
		}else if(world.map[cat.y][cat.x] === 3){
			world.map[cat.y][cat.x] = 0;
			score.value+=5;
			score.draw(score.value);
			world.update(cat.x, cat.y);
		}
	},
	move: ({code:keyPressed})=>{
		if(keyPressed === 'ArrowLeft' && world.map[cat.y][cat.x-1] !== 1){
			cat.x--;
		}else if(keyPressed === 'ArrowRight' && world.map[cat.y][cat.x+1] !== 1){
			cat.x++;
		}
		if(keyPressed === 'ArrowUp' && world.map[cat.y-1][cat.x] !== 1){
			cat.y--;
		}else if(keyPressed === 'ArrowDown' && world.map[cat.y+1][cat.x] !== 1){
			cat.y++;
		}
		let elemHTML = document.getElementById('cat');
		elemHTML.style.top = (cat.y*40) +'px';
		elemHTML.style.left = (cat.x*40) +'px';
		cat.eat();
		dog.bite();
	}
}
let dog = {
	x: 2,
	y: 3,
	bite: ()=>{
		if((cat.x === dog.x) && (cat.y === dog.y)){
			let heart = document.querySelector(`#vida img.heart-${cat.life}`);
			if(heart) {
				heart.classList.add('less');
				cat.life -=1;
			}
		}
	},
	move: ()=>{
		let move = random(-1,4);
		if(move ===0 && (world.map[dog.y][dog.x-1] !==1)){//0 = left
			dog.x--;
		}else if(move ===1 && (world.map[dog.y][dog.x+1] !==1)){//1 = right
			dog.x++;
		}else if(move ===2 && (world.map[dog.y-1][dog.x] !==1)){//2 = up
			dog.y--;
		}else if(move ===3 && (world.map[dog.y+1][dog.x] !==1)){//3 = down
			dog.y++;
		}
		document.getElementById('dog').style.top = (dog.y*40) +'px';
		document.getElementById('dog').style.left = (dog.x*40) +'px';
		dog.bite();
	}
}
let score = {
	value: 0,
	max: 0,
	init: ()=>{
		score.value = 0;
		score.max = world.map.reduce((accFila, fila) => {
			let sumaFila = fila.reduce((accValor, valor) => {
				if (valor === 2) return accValor + 10;
				if (valor === 3) return accValor + 5;
				return accValor;
			}, 0);
			return accFila + sumaFila;
		}, 0);
	},
	draw: ()=>{
		document.querySelector('#score-value').textContent = `Score: ${score.value} - ${score.max}`;
	}
};

game.init();