const env = {
  api: "/api/",
};

const cells = new Array();

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
      env.cellCode = res;
      load(() => {
        reading();
        resizing();
        placeCircles(5);
      });
    },
  });
};

const load = (callback) => {
  $.ajax({
    url: `${env.api}v1/init/`,
    method: "GET", // POST
    data: {},
    success: (res) => {
      JSON.parse(res).room.map((x) => cells.push(x));
      callback();
    },
  });
};

window.onresize = () => {
  resizing();
};

const DEPTH = 8;

const reading = () => {
  const numArr = [
    15, 16, 17, 18, 19, 20, 21, 22, 14, 23, 13, 24, 12, 25, 11, 26, 10, 27, 9,
    28, 8, 7, 6, 5, 4, 3, 2, 1,
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
      desc.innerText = env.cellCode[cells[numArr[num] - 1]].title;
      cell.appendChild(desc);
      row.appendChild(cell);
      num++;
    }
    map.appendChild(row);
  }
};

const resizing = () => {
  const cell_size = (Math.min(window.innerHeight, window.innerWidth) - 100) / 8;
  for (let i = 0; i < (DEPTH - 1) * 4; i++) {
    const elem = document.getElementsByClassName("cell")[i];
    elem.style.width = `${cell_size}px`;
    elem.style.height = `${cell_size}px`;
  }

  const corner = document.getElementsByClassName("corner");
  for (let i = 0; i < corner.length; i++) {
    corner[i].style.width = `${cell_size}px`;
    corner[i].style.height = `${cell_size}px`;
  }
};

const rollDice = () => {
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  const image = document.getElementById("dice-image");
  image.src = `static/dice${randomNumber}.png`;
  image.setAttribute("active", "");
};

/* const MAX_CIRCLES = 8; // 최대 원 개수

const addCircles = (count) => {
  const map = document.querySelector('.map');
  map.innerHTML = ''; // 기존 원 삭제

  for (let i = 0; i < count; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    map.appendChild(circle);
  }
};

const updateCircles = () => {
  const cell_size = (Math.min(window.innerHeight, window.innerWidth) - 100) / 8;
  const circles = document.querySelectorAll('.circle');

  circles.forEach(circle => {
    circle.style.width = `${cell_size / 8}px`;
    circle.style.height = `${cell_size / 8}px`;
  });
};

window.onload = () => {
  addCircles(4); // 초기에 4개의 원 생성
  updateCircles(); // 크기 업데이트
};

window.onresize = () => {
  updateCircles(); // 창 크기 변경 시 크기 업데이트
}; */