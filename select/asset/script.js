let count;

window.onload = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  count = urlParams.get("count");
  if (count !== null && !isNaN(count)) {
    count *= 1;
    if (count >= 1 && count <= 8) render(count);
    else location.href = "/";
  } else location.href = "/";
};

const render = () => {
  const container = document.querySelector(".container");
  let str = "";
  for (let i = 1; i < count + 1; i++) {
    str += `
      <div class="user">
        <img src="/play/static/cap${i}.png" />
        <input type="text" class="username" placeholder="플레이어명(팀명)"/>
      </div>
    `;
  }
  container.innerHTML = str + `<button id="btn" onclick="play()">설정</button>`;
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
      goal: 20,
      teams,
    }),
    success: (res) => {
      sessionStorage.setItem("gameId", res.gameId);
      location.href = "/play";
    },
  });
};
