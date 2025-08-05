async function request() {
  const response = await fetch("./src/games.json");
  const data = await response.json();
  return data;
}

let games = await request();
let skillIcons = "https://raw.githubusercontent.com/McMaldo/skill-icons/main/icons/";

let gameList = games.map(game => /*html*/`
  <article class="game-item">
    <h3>${game.name}</h3>
    <a href="./game/${game.url}">
      View Demo
      <img src="./public/icon/arrow.svg" alt="open" />
    </a>
    <img class="portrait" src="./public/img/${game.url}.png" alt="${game.name} image" />
  </article>`
).join('');

document.querySelector('#game-list').innerHTML = gameList;