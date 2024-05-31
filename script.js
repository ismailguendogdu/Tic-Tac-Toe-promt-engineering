let fields = [null, null, null, null, null, null, null, null, null];

let currentPlayer = "circle";

function render() {
  const container = document.getElementById("container");
  let tableHtml = "<table>";
  for (let i = 0; i < 3; i++) {
    tableHtml += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let cellContent = "";
      if (fields[index] === "circle") {
        cellContent = generateCircleSVG();
      } else if (fields[index] === "cross") {
        cellContent = generateCrossSVG();
      }
      tableHtml += `<td onclick="handleClick(event, ${index})">${cellContent}</td>`;
    }
    tableHtml += "</tr>";
  }
  tableHtml += "</table>";
  container.innerHTML = tableHtml;
}

function handleClick(event, index) {
  if (fields[index] === null) {
    fields[index] = currentPlayer;
    if (currentPlayer === "circle") {
      event.target.innerHTML = generateCircleSVG();
      currentPlayer = "cross";
    } else {
      event.target.innerHTML = generateCrossSVG();
      currentPlayer = "circle";
    }
    event.target.onclick = null;

    const winner = checkWinner();
    if (winner) {
      drawWinningLine(winner);
    }
  }
}

function generateCircleSVG() {
  return `
        <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0EF" stroke-width="5">
                <animate attributeName="r" from="0" to="30" dur="1s" begin="0s" fill="freeze" />
                <animate attributeName="stroke-dasharray" from="0, 200" to="200, 200" dur="1s" begin="0s" fill="freeze" />
            </circle>
        </svg>
    `;
}

function generateCrossSVG() {
  return `
        <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="10" x2="60" y2="60" stroke="#FFC000" stroke-width="5">
                <animate attributeName="x2" from="10" to="60" dur="1s" begin="0s" fill="freeze" />
                <animate attributeName="y2" from="10" to="60" dur="1s" begin="0s" fill="freeze" />
            </line>
            <line x1="10" y1="60" x2="60" y2="10" stroke="#FFC000" stroke-width="5">
                <animate attributeName="x2" from="10" to="60" dur="1s" begin="0s" fill="freeze" />
                <animate attributeName="y2" from="60" to="10" dur="1s" begin="0s" fill="freeze" />
            </line>
        </svg>
    `;
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return combination;
    }
  }
  return null;
}

function drawWinningLine(winningCombination) {
    const container = document.getElementById("container");
    const line = document.createElement("div");
    line.classList.add("line");

    const start = container.querySelectorAll("td")[winningCombination[0]].getBoundingClientRect();
    const end = container.querySelectorAll("td")[winningCombination[2]].getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    line.style.width = `${Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))}px`;
    line.style.transform = `rotate(${Math.atan2(end.y - start.y, end.x - start.x)}rad)`;
    line.style.top = `${(start.y + end.y) / 2 - containerRect.top}px`;
    line.style.left = `${(start.x + end.x) / 2 - containerRect.left}px`;

    container.appendChild(line);
}

function restartGame() {
    fields = [null, null, null, null, null, null, null, null, null];
    currentPlayer = "circle";
    render();
}