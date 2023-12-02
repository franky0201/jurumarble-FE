let count;

window.onload = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  count = urlParams.get("count");
  if (count !== null && !isNaN(count)) {
    count *= 1;
    if (count >= 1 && count <= 8) render(count);
    else location.href = "/jurumarble-FE/";
  } else location.href = "/jurumarble-FE/";
};

let goal = 1;
//희상이 추가부분
function increment() {
  if (goal < 3) goal++;
  updateDisplay();
}

function decrement() {
  if (goal > 1) goal--;
  updateDisplay();
}

function updateDisplay() {
  document.getElementById("goal").innerText = goal;
}
//희상이 추가부분

const render = () => {
  const container = document.querySelector(".container");
  let str = "";
  for (let i = 1; i < count + 1; i++) {
    str += `
      <div class="user">
        <img src="/jurumarble-FE/play/static/cap${i}.png" />
        <input type="text" class="username" placeholder="플레이어명(팀명)"/>
      </div>
    `;
  }
  //희상이 추가부분
  container.innerHTML =
    str +
    `
  <div id="play-count">
  <span>몇바퀴 돌래?</span>
  <button id="minus" class="btn">-</button>
  <span id="goal">${goal}</span>
  <button id="plus" class="btn">+</button>
</div>
<button id="btn" onclick="seletcion()">설정</button><button id="btn" onclick="play()">설정</button>`;
  //희상이 추가부분
  document.getElementById("plus").addEventListener("click", increment);
  document.getElementById("minus").addEventListener("click", decrement);
};

const play = () => {
  const teams = [];
  const username = document.getElementsByClassName("username");
  for (let i = 0; i < username.length; i++) {
    teams.push({ name: username[i].value });
  }

  $.ajax({
    url: baseURL + "/api/v1/status/start",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      goal: goal,
      teams,
    }),
    success: (res) => {
      sessionStorage.setItem("gameId", res.gameId);
      location.href = "/jurumarble-FE/play";
    },
  });
};
