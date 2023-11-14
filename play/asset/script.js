const env = {
  api: "/api/",
};

const cells = new Array();

window.onload = async () => {
  $.ajax({
    url: "./static/cell.json",
    method: "GET",
    success: (res) => {
      env.cellCode = res;
      load(() => {
        reading();
        resizing();
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
