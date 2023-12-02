let cellCode,
  gameStatus = false;
const cells = new Array();
const DEPTH = 8;

const placeCircles = () => {
  const cells = document.querySelectorAll(".cell");
  const images = [];

  // 이미지 경로 설정
  for (let i = 1; i <= 8; i++) {
    images.push(`static/cap${i}.png`);
  }

  cells.forEach((cell) => {
    const numCircles = Math.floor(Math.random() * 9); // 각 cell에 표시할 원의 개수 (0~8개 중에서 무작위로 선택)
    const cellSize = cell.clientWidth; // cell의 너비를 기준으로 함
    const circleSize = cellSize / 5; //사이즈 조절
    const gap = 2; // 간격 설정
    const margin = 2; // 원과 cell 사이의 여백

    for (let i = 0; i < numCircles; i++) {
      const circle = document.createElement("div");
      circle.classList.add("circle");

      const circleImage = new Image();
      circleImage.classList.add("circle-image");
      circleImage.src = images[i % images.length]; // 이미지 경로 설정

      circleImage.style.width = `${circleSize}px`;
      circleImage.style.height = `${circleSize}px`;

      const row = Math.floor(i / 4); // 행 번호 계산
      const col = i % 4; // 열 번호 계산

      circle.style.top = `${row * (circleSize + 5)}px`;
      circle.style.left = `${col * (circleSize + 5)}px`;

      circle.appendChild(circleImage);
      cell.appendChild(circle);
    }
  });
};

window.onload = async () => {
  $.ajax({
    url: "./static/cell.json",
    method: "GET",
    success: (res) => {
      cellCode = res;
      getStatus(() =>
        getMap(() => loadPlayer(() => resizing(() => placeCircles())))
      );
    },
  });
};

window.onresize = () => {
  resizing();
  setHorse();
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

var cellpos_top = [];
var cellpos_left = [];
const getMap = (callback = null) => {
  console.log("gameId: ", gameStatus.gameId);
  $.ajax({
    url: `${baseURL}/api/v1/game-table/${gameStatus.gameId}`,
    method: "GET",
    contentType: "application/json",
    success: (res) => {
      console.log("res: ", res);
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

/*
1130 ezcho, 우선 api체크 하고 콘솔로 출력,
rollDice response 후 황금열쇠 pos%7로 판단

황금열쇠일경우 goldKey함수 -> 황금열쇠 호출 -> result.name으로 name 확인
STACK_PUSH, STACK_POP 처리
STACK_POP 응답 예시
{"stack":7,"name":"a","id":22,"position":10}
*/
const goldKey = () => {
  $.ajax({
    url: `${baseURL}/api/v1/goldKey`,
    method: "GET",
    success: function (goldKey) {
      console.log("황금열쇠: GOLDENKEY", goldKey);
      switch (goldKey.name) {
        case "BACK":
          $.ajax({
            url: `${baseURL}/api/v1/status/${gameStatus.gameId}/back`,
            method: "POST",
            success: function (resBack) {
              console.log("BACK", resBack);
            },
          });
          break;
        default:
          break;
      }
    },
    error: function (error) {
      console.error("주사위 굴리기 오류:", error);
    },
  });
};

//Data처리 어떻게하는게 바람직한건지 판단,
const cellData = {
  MAN: { title: "남자 마시기", desc: "남자답게 한 잔 마시기!" },
  WOMAN: { title: "여자 마시기", desc: "여자답게 한 잔 마시기!" },
  OPPOSITE: {
    title: "맞은 편 마시기",
    desc: "당신의 맞은편을 바라보고 한 잔을 건네자!",
  },
  ODD: { title: "생일 홀수 마시기", desc: "1,3,5,7,9,11월생 마셔!" },
  EVEN: { title: "생일 짝수 마시기", desc: "2,4,6,8,10,12월생 마셔!" },
  ALL: { title: "다같이 마시기", desc: "우리는 모두 친구♪" },
  EXCEPT: { title: "나 빼고 다 마셔!", desc: "나만 아니면 돼~" },
  YOU: { title: "나만 마시기", desc: "고독한 한 잔" },
  BOMB: { title: "폭탄주", desc: "폭탄 받아라💣" },
  RANDOM: { title: "폭탄주", desc: "폭탄 받아라💣" },
  SELECT: { title: "랜덤 게임", desc: "랜덤 게임 시작!" },
  NOONCHI: { title: "눈치 게임", desc: "눈치게임 시작!" },
  IPHONE: { title: "아이폰 마시기", desc: "당신이 앱등이라면 한 잔!" },
  GALAXY: { title: "갤럭시 마시기", desc: "당신이 삼엽충이라면 한 잔!" },
  GOLDENKEY: { title: "황금 열쇠", desc: false },
  TWO_TOUCH: {
    title: "투터치",
    desc: "10분 동안 모든 물건을 들었다 내려 놓을 때 바닥에 두 번 두드려야 해요. 집중 못하는 사람은 한 잔!",
  },
  REST: { title: "다음 턴 쉬기", desc: "열심히 마신 당신, 쉬어라" },
  H2O: { title: "물 마시기", desc: "물 한 잔 하고 가요~" },
  ANJOO: { title: "안주먹기", desc: "안주 먹을 시간이 있어요~" },
  SEJONG: {
    title: "훈민정음",
    desc: "10분 동안 한글만 사용해야 해요. 외래어를 사용할 시 한 잔!",
  },
  NO_ANJOO: {
    title: "No 안주",
    desc: "(주사위 눈의 수)분 동안 안주를 먹을 수 없어요",
  },
  AWESOME: {
    title: "훈남훈녀 마시기",
    desc: "자신이 훈남 훈녀라고 생각한다면 한 잔!",
  },
  LOVE: { title: "지목 러브샷", desc: "❤️" },
  BANWORD: {
    title: "한 턴 금지어 게임",
    desc: "주사위가 한 바퀴를 돌 때까지 지정된 금지어를 말할 수 없어요",
  },
  FRIENDSHIP: {
    title: "의리주",
    desc: "(인원수 × 1/3)병 마시기!",
  },
  OME: {
    title: "애교하고 인정 받기",
    desc: "안 하면 '한 병', 노인정 '한 잔",
  },
  ISLAND: { title: "무인도", desc: "열심히 마신 당신 떠나라" },
  START: { title: "START", desc: "아무것도 없는 그냥 시작 지점" },
  STACK_PUSH: {
    title: "축적주 누적",
    desc: "축적주가 한 병 1병 누적됐어요!",
  },
  STACK_POP: { title: "축적주 마시기", desc: "ㅅㄱ" },
  NORTHKOREA: { title: "공산당", desc: "동무, 마시라우-" },
  STAND: {
    title: "물병 세우기",
    desc: "돌아가며 물병 세우기를 합니다! 성공한 팀 빼고 다 마셔야 해요",
  },
  "007": { title: "침묵 007", desc: "" },
  BACK3: { title: "세 칸 뒤로", desc: "<<" },
  FORWARD3: { title: "세 칸 앞으로", desc: ">>" },
  SINGASONG: { title: "전국 노래자랑", desc: "♪" },
  GREENLIGHT: { title: "이성 번호 따기", desc: "" },
  PEE: {
    title: "화장실 금지",
    desc: "10분 동안 화장실에 갈 수 없어요. 가려면 다녀온 후 한 잔 마셔야 해요!",
  },
  CALLME: {
    title: "답장 게임",
    desc: "아무한테나 전화 걸고 바로 끊은 뒤, 가장 먼저 연락을 받은 팀을 제외하고 모두 한 잔씩 마셔야 해요",
  },
  SENIOR: { title: "1~6월 생일 마시기", desc: "" },
  JUNIOR: { title: "7~12월 생일 마시기", desc: "" },
  BOTH: { title: "양 옆 마시기", desc: "" },
  NULL: { title: "쉬는 칸", desc: "이걸 사네" },
};
var img = [];
const rollDice = () => {
  const gameId = sessionStorage.getItem("gameId");
  const diceValue = Math.floor(Math.random() * 6) + 1;
  var dice = document.getElementsByClassName("dice");
  dice[0].innerHTML = diceValue;

  const image = document.getElementById("dice-image");
  $.ajax({
    url: `${baseURL}/api/v1/status/${gameId}/dice`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ value: diceValue }),
    success: function (result) {
      if (typeof result.wins !== "undefined") {
        alert(result.wins, "승리");
        window.location.href = baseURL + "/";
      }
      const pos = result.position;
      img[1].style.left = cellpos_left[pos] + 20 * 1 + "px";
      img[1].style.top = cellpos_top[pos] + 20 * 1 + "px";

      if (pos % 7 == 4) {
        //고정된 황금열쇠 판단
        goldKey();
      } else if (pos == 8) {
        //고정칸 1
        $.ajax({
          url: `${baseURL}/api/v1/status/${gameStatus.gameId}/stack_push`,
          method: "POST",
          success: function (resStackPush) {
            console.log("일반: STACKPUSH", resStackPush.stack);
            var drinkCounter = document.getElementById("drink-counter");
            drinkCounter.innerHTML = resStackPush.stack + "잔 축척됨!";
          },
        });
      } else if (pos == 22) {
        //고정칸 2
        $.ajax({
          url: `${baseURL}/api/v1/status/${gameStatus.gameId}/stack_pop`,
          method: "GET",
          success: function (resStackPop) {
            console.log(
              "일반: STACKPOP, 마셔야할 잔:",
              resStackPop.name,
              resStackPop.stack
            );
            var drinkCounter = document.getElementById("drink-counter");
            drinkCounter.innerHTML = "0잔 축척됨!";
          },
        });
      } else {
        $.ajax({
          url: `${baseURL}/api/v1/game-table/${gameId}`,
          method: "GET",
          contentType: "application/json",
          success: (map) => {
            var key = map[pos - 1].name;
            var title = null;
            var describe = null;
            if (cellData.hasOwnProperty(key)) {
              describe = cellData[key].desc;
              title = cellData[key].title;
            } else {
              console.log("에러");
            }
            console.log("일반: ", key);
            console.log(`Title: ${title}, Desc: ${describe}`);
            var firstLine = document.getElementsByClassName("overlaytext1")[0];
            if (firstLine) {
              firstLine.innerHTML = title;
            }
            var secondLine = document.getElementsByClassName("overlaytext2")[0];
            var thirdLine = document.getElementsByClassName("overlaytext3")[0];

            if (describe && describe.length > 10) {
              // 문자열이 10글자를 초과하면, 나눠서 표시
              var middleIndex = Math.floor(describe.length / 2);
              var firstPart = describe.substring(0, middleIndex);
              var secondPart = describe.substring(middleIndex);

              secondLine.innerHTML = firstPart;
              thirdLine.innerHTML = secondPart;
            } else {
              // 10글자 이하면 secondLine에만 표시
              secondLine.innerHTML = describe;
              thirdLine.innerHTML = ""; // thirdLine은 비우고
            }
          },
        });
      }
      console.log(result);
      if (typeof result.wins !== "undefined") {
        alert(result.wins, "승리");
        window.location.href = baseURL + "/";
      }
    },
    error: function (error) {
      console.error("주사위 굴리기 오류:", error);
    },
  });
};

const loadPlayer = (callback = null) => {
  const pos = 1;

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
    setHorse();
  }, 1);
};

const setHorse = () => {
  cellpos_top[0] = 0;
  cellpos_left[0] = 0;
  for (let i = 1; i <= 28; i++) {
    var element = document.getElementById("cell_" + [i]);
    var rect = element.getBoundingClientRect();
    cellpos_top[i] = rect.top;
    cellpos_left[i] = rect.left;
  }
  console.log(cellpos_top);
  console.log(cellpos_left);
  var element = document.getElementById("cell_" + 1);
  var rect = element.getBoundingClientRect();
  for (let i = 0; i < 2; i++) {
    img[i] = document.createElement("img");
    img[i].src = `static/cap${i + 1}.png`;
    img[i].className = `cap${i + 1}`;
    img[i].style.left = cellpos_left[1] + 10 * i + "px";
    img[i].style.top = cellpos_top[1] + 10 * i + "px";
    document.body.appendChild(img[i]);
  }
};
