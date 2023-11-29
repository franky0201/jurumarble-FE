let cellCode,
  gameStatus = false;
const cells = new Array();
const DEPTH = 8;

window.onload = async () => {
  $.ajax({
    url: "./static/cell.json",
    method: "GET",
    success: (res) => {
      cellCode = res;
      getStatus(() => getMap(() => loadPlayer(() => resizing())));
    },
  });
};

window.onresize = () => {
  resizing();
};

const getStatus = (callback = null) => {
  const gameId = sessionStorage.getItem("gameId");
  if (!gameId) location.href = "/";
  $.ajax({
    url: `${baseURL}/api/v1/status/${gameId}`,
    method: "GET",
    contentType: "application/json",
    success: (res) => {
      if (res === "") {
        sessionStorage.removeItem("gameId");
        location.href = "/";
      } else {
        gameStatus = res;
        if (callback) callback();
      }
    },
  });
};

const getMap = (callback = null) => {
  $.ajax({
    url: `${baseURL}/api/v1/game-table/${gameStatus.gameId}`,
    method: "GET",
    contentType: "application/json",
    success: (res) => {
      res.map((x) => cells.push(x));
      const numArr = [
        15, 16, 17, 18, 19, 20, 21, 22, 14, 23, 13, 24, 12, 25, 11, 26, 10, 27,
        9, 28, 8, 7, 6, 5, 4, 3, 2, 1,
      ];
      const corner = [1, 8, 15, 22];
      let num = 0;
      const map = document.getElementsByClassName("map")[0];
      for (let i = 0; i < DEPTH; i++) {
        const row = document.createElement("div");
        for (let j = 0; j < (i === DEPTH - 1 || i === 0 ? DEPTH : 2); j++) {
          const cell = document.createElement("div");
          cell.classList = "cell";
          cell.id = `cell_${numArr[num]}`;
          cell.setAttribute("isCorner", corner.includes(numArr[num]));
          const desc = document.createElement("span");
          desc.innerText =
            cellCode[cells[numArr[num] - 1]?.name ?? ""]?.title ?? "";
          cell.appendChild(desc);
          row.appendChild(cell);
          num++;
        }
        map.appendChild(row);
      }
      if (callback) callback();
    },
  });
};

const loadPlayer = (callback = null) => {
  let html = "";
  for (let i = 0; i < gameStatus.teams.length; i++) {
    html += `
      <div class="players">
        <div class="logo">
          <img src="static/cap${i + 1}.png" />
        </div>
        <div class="player">
          ${gameStatus.teams[i].name}
          <!--<img src="static/island.png"  /> n턴 <br />남음!-->
        </div>
      </div>
    `;
  }
  document.getElementsByClassName("left")[0].innerHTML = html;
  if (callback) callback();
};

const resizing = () => {
  const set = (size) => {
    for (let i = 0; i < (DEPTH - 1) * 4; i++) {
      const elem = document.getElementsByClassName("cell")[i];
      elem.style.width = `${size}px`;
      elem.style.height = `${size}px`;
    }

    const corner = document.getElementsByClassName("corner");
    for (let i = 0; i < corner.length; i++) {
      corner[i].style.width = `${size}px`;
      corner[i].style.height = `${size}px`;
    }
  };

  set(0);
  setTimeout(() => {
    set((Math.min(window.innerHeight, window.innerWidth) - 100) / 8);
  }, 1);
};

const rollDice = () => {
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  const image = document.getElementById("dice-image");
  image.src = `static/dice${randomNumber}.png`;
  image.setAttribute("active", "");
};
