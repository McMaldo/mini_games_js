async function request() {
  const response = await fetch("./src/games.json");
  const data = await response.json();
  return data;
}

let games = await request();
let skillIcons = "https://raw.githubusercontent.com/McMaldo/skill-icons/main/icons/";

let gameList = games.map(game => /*html*/`
  <article class="game-item">
    <div class="desc">
      <p>${game.desc}</p>
      <div class="controls">
        <div class="group">
          <div class="btn">w</div>
          <span>
            <div class="btn">a</div>
            <div class="btn">s</div>
            <div class="btn">d</div>
          </span>
        </div>
        ${game.key == "space" ? `<div class="btn">__</div>` : ""}
      </div>
    </div>
    <span class="heading">
      <h3>${game.name}</h3>
      ${game.url? `<a href="./game/${game.url}" class="btn">
        <img src="./public/icon/arrow.png" alt="" />Play
      </a>` : ""}
    </span>
    <img class="portrait" src="./public/img/${game.url}.png" alt="" />
  </article>`
).join('');

document.querySelector('#game-list').innerHTML = gameList;