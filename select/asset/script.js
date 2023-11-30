window.onload = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userCount = urlParams.get("userCount");
  if (userCount !== null && !isNaN(userCount)) {
    howmany(userCount * 1);
  }
};

let count = 1; // 초기 값은 1로 설정합니다.

function howmany(n) {
  const container = document.querySelector(".container");
  let str = "";
  for (let i = 1; i < n + 1; i++) {
    str += `
      <div class="user">
        <img src="./static/cap${i}.png" />
        <input type="text" placeholder="플레이어명(팀명)"/>
      </div>
    `;
  }
  // +와 - 버튼 및 '몇바퀴?' 문구를 가로로 나열
  str += `
    <div id="play-count">
      <span>몇바퀴 돌래?</span>
      <button id="minus" class="btn">-</button>
      <span id="count">${count}</span>
      <button id="plus" class="btn">+</button>
    </div>
    <button id="btn" onclick="seletcion()">설정</button>
  `;

  container.innerHTML = str;

  // +와 - 버튼에 클릭 이벤트 추가
  document.getElementById("plus").addEventListener("click", increment);
  document.getElementById("minus").addEventListener("click", decrement);
}

function increment() {
  if (count < 3) count++;
  updateDisplay();
}

function decrement() {
  if (count > 1) count--;
  updateDisplay();
}

function updateDisplay() {
  document.getElementById("count").innerText = count;
}