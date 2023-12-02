let count = 2;

function updateDisplay() {
  document.getElementById("count").textContent = count;
}

function increment() {
  if (count < 8) count++;
  updateDisplay();
}

function decrement() {
  if (count > 2) {
    count--;
  }
  updateDisplay();
}

window.onload = function () {
  updateDisplay();
};

function start() {
  location.href = "/jurumarble-FE/select/?count=" + count;
}
