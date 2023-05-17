let gameOver = false;
let sizeX = 10;
let sizeY = 10;
let openedCellCount = 0;
let mineCount = 1;
let interval;
let seconds;
let minutes;
let hours;
let isTimerStarted = false;
let myBoard
let movingCounter = 0

const startBtn = document.createElement('button');
startBtn.classList.add('startBtn');
startBtn.textContent = 'Начать новую игру';
document.querySelector('body').append(startBtn);

const timerDiv = document.createElement('div');
const timer = document.createElement('h1');
timer.textContent = '00:00:00';
timerDiv.append(timer);
document.querySelector('body').prepend(timerDiv);

function cell(row, column, opened, marked, mined, minesCount) {
  return {
    id: row + '-' + column,
    row,
    column,
    opened,
    marked,
    mined,
    minesCount,
  };
}

function board(sizeX, sizeY, mineCount) {
  let field = {};
  for (let row = 0; row < sizeX; row++) {
    for (let col = 0; col < sizeY; col++) {
      field[row + '-' + col] = cell(row, col, false, false, false, 0);
    }
  }
  setMines(field, sizeX, sizeY, mineCount);
  calcNeighbors(field);
  return field;
}

const getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

function getRandomCoors(sizeX, sizeY) {
  let randomRow = getRandomInteger(0, sizeX);
  let randomColumn = getRandomInteger(0, sizeY);
  return randomRow + '-' + randomColumn;
}

function setMines(field, sizeX, sizeY, minesCount) {
  let mineCoors = [];
  for (let i = 0; i < minesCount; i++) {
    let cellId = getRandomCoors(sizeX, sizeY);
    while (mineCoors.includes(cellId)) {
      cellId = getRandomCoors(sizeX, sizeY);
    }
    mineCoors.push(cellId);
    field[cellId].mined = true;
  }
  return field;
}

const calcNeighbors = function (field) {
  for (let cellId in field) {
    if (!field[cellId].mined) {
      let neighbors = getNeighbors(cellId);
      let neighborMineCount = 0;
      neighbors.forEach(neighbor => {
        neighborMineCount += isMined(field, neighbor);
      });
      field[cellId].minesCount = neighborMineCount;
    }
  }
  return field;
};

const getNeighbors = function (id) {
  const row = parseInt(id.split('-')[0]);
  const column = parseInt(id.split('-')[1]);
  let neighbors = [];
  neighbors.push((row - 1) + '-' + (column - 1));
  neighbors.push((row - 1) + '-' + column);
  neighbors.push((row - 1) + '-' + (column + 1));
  neighbors.push(row + '-' + (column - 1));
  neighbors.push(row + '-' + (column + 1));
  neighbors.push((row + 1) + '-' + (column - 1));
  neighbors.push((row + 1) + '-' + column);
  neighbors.push((row + 1) + '-' + (column + 1));
  for (let i = 0; i < neighbors.length; i++) {
    if (neighbors[i].length < 2) {
      neighbors.splice(i, 1);
      i--;
    }
  }
  return neighbors;
};

const isMined = function (board, id) {
  const cell = board[id];
  let mined = 0;
  if (typeof cell !== 'undefined') {
    mined = cell.mined ? true : false;
  }
  // console.log(mined);
  return mined;
};

function setColor(mines, cell) {
  switch (mines) {
    case 1:
      cell.classList.add('cell_green');
      break;
    case 2:
      cell.classList.add('cell_yellow');
      break;
    case 3:
      cell.classList.add('cell_l-blue');
      break;
    case 4:
      cell.classList.add('cell_blue');
      break;
    case 5:
      cell.classList.add('cell_l-purple');
      break;
    case 6:
      cell.classList.add('cell_purple');
      break;
    case 7:
      cell.classList.add('cell_red');
      break;
    case 8:
      cell.classList.add('cell_d-red');
      break;
  }
}

const setFlag = function (id) {

  // установить флаг
};

function isSetFlag(event) {
  return false;
//  проверить событие содержит ли contextmenu
}

function loss() {
  clearInterval(interval);
  seconds = 0;
  minutes = 0;
  hours = 0;
  gameOver = true;
  mineCount = 0
  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  alert('Game over. Try again');
}

function win() {
  clearInterval(interval);
  alert(`Hooray! You found all mines in ${seconds} seconds and ${movingCounter} moves!`);
  seconds = 0;
  minutes = 0;
  hours = 0;
  movingCounter = 0
  // isTimerStarted = false;

}

const handleClick = function (cell, cellButton) {
  if (!gameOver) {
    if (!cell.opened && !cell.marked) {
      if (cell.mined) {
        loss();
      } else {
        cellButton.classList.add('button-cell_opened');
        openedCellCount++;
        if ((sizeY * sizeY - mineCount - openedCellCount) == 0) {
          win();
        }
        cell.opened = true;
        if (cell.minesCount > 0) {
          cellButton.textContent = cell.minesCount;
          setColor(cell.minesCount, cellButton);
          //  добавляем на ячейку количество бобм по соседству
        } else {
          //если по соседству нет бомб
          const neighbors = getNeighbors(cell.id);
          neighbors.forEach(neighbor => {
            if (typeof myBoard[neighbor] !== 'undefined' && !myBoard[neighbor].marked && !myBoard[neighbor].opened) {
              handleClick(myBoard[neighbor], document.getElementById(neighbor));
            }
          });
        }
      }
    }
  }
};

function updateTime(s, m, h) {
  s++;
  if (s === 60) {
    m++;

    s = 0;
  }
  if (m === 60) {
    h++;
    m = 0;
  }
  seconds = s;
  minutes = m;
  hours = h;
  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startGame(x = 10, y, minesCount) {
  sizeY = y;
  sizeX = x;
  mineCount = minesCount;
  openedCellCount = 0;
  gameOver = false;
  myBoard = board(sizeX, sizeY, mineCount);
  const fieldTag = document.createElement('div');
  fieldTag.classList.add('field');
  fieldTag.style.gridTemplateColumns = ``;

  fieldTag.setAttribute('style', `grid-template-columns: repeat(${sizeY}, 20px); grid-template-rows: repeat(${sizeX}, 20px)`);

  for (let cell in myBoard) {
    let cellButton = document.createElement('button');
    cellButton.classList.add('button-cell');
    cellButton.id = cell

    cellButton.addEventListener('click', (event) => {
      movingCounter++
      handleClick(myBoard[cell], cellButton);
      if (!isTimerStarted) {
        isTimerStarted = true;
        seconds = 0;
        minutes = 0;
        hours = 0;
        interval = setInterval(() => updateTime(seconds, minutes, hours), 1000);
      }
    });
    fieldTag.append(cellButton);
  }
  document.querySelector('body').append(fieldTag);
}

startGame(3, 3, 5);

startBtn.addEventListener('click', () => {
  clearInterval(interval);
  seconds = 0;
  minutes = 0;
  hours = 0;
  isTimerStarted = false;
  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  document.querySelector('.field').remove();
  startGame(6, 6, 5);
});



