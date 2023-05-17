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
let myBoard;
let movingCounter = 0;
let curLevel = 'easy'

const main = document.createElement('main');
document.querySelector('body').append(main);

const levelForm = document.createElement('form');

const moveCounter = document.createElement('h2')
moveCounter.textContent = `Количество шагов ${movingCounter}`
const minesCountLabel = document.createElement('label');
minesCountLabel.textContent = 'Количество бомб';
const minesCountInput = document.createElement('input');
minesCountInput.value = 10;
minesCountInput.name = 'mines'
minesCountLabel.append(minesCountInput);
const levelButtons = document.createElement('div');
levelButtons.classList.add('level-buttons');
const easyLevelLabel = document.createElement('label');
easyLevelLabel.textContent = 'easy';
const mediumLevelLabel = document.createElement('label');
mediumLevelLabel.textContent = 'medium';
const hardLevelLabel = document.createElement('label');
hardLevelLabel.textContent = 'hard';
const easyLevelButton = document.createElement('input');
easyLevelButton.classList.add('input_easy-level');
easyLevelButton.type = 'radio';
easyLevelButton.checked = true
easyLevelButton.name = 'level';
easyLevelButton.value = 'easy';
easyLevelButton.textContent = 'easy';
easyLevelLabel.append(easyLevelButton);
const mediumLevelButton = document.createElement('input');
mediumLevelButton.type = 'radio';
mediumLevelButton.name = 'level';
mediumLevelButton.value = 'medium';
mediumLevelButton.classList.add('input_medium-level');
mediumLevelLabel.append(mediumLevelButton);
const hardLevelButton = document.createElement('input');
hardLevelButton.classList.add('input_hard-level');
hardLevelButton.type = 'radio';
hardLevelButton.value = 'hard';
hardLevelButton.name = 'level';
hardLevelLabel.append(hardLevelButton);
levelButtons.append(easyLevelLabel, mediumLevelLabel, hardLevelLabel);
const startBtn = document.createElement('button');
startBtn.classList.add('startBtn');
startBtn.type = 'submit';
startBtn.textContent = 'Начать новую игру';
levelForm.onsubmit = (e) => {
  e.preventDefault();
  clearInterval(interval);
  seconds = 0;
  minutes = 0;
  hours = 0;
  isTimerStarted = false;
  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  document.querySelector('.field').remove();
  const level = setLevel(curLevel, minesCountInput.value)
  const { x, y, mines } = level
  startGame(x, y, mines);
};
levelForm.onchange = (e) => {
  if (e.target.name == 'level') {
    curLevel = e.target.value
  } else if (e.target.name == 'mines' ) {
    mineCount = +e.target.value
  }
}

levelForm.append(levelButtons, minesCountLabel, startBtn);
main.append(levelForm);

function setLevel(level, mines) {
  switch (level) {
    case 'easy':
      return { x: 10, y: 10, mines: mines };
    case 'medium':
      return { x: 15, y: 15, mines: mines };
    case 'hard':
      return { x: 25, y: 25, mines: mines };
  }
}

const timerDiv = document.createElement('div');
timerDiv.classList.add('timer');
const timer = document.createElement('h1');
timer.textContent = '00:00:00';
timerDiv.append(timer);
main.prepend(timerDiv);

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
  mineCount = 0;
  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  alert('Game over. Try again');
}

function win() {
  clearInterval(interval);
  alert(`Hooray! You found all mines in ${seconds} seconds and ${movingCounter} moves!`);
  seconds = 0;
  minutes = 0;
  hours = 0;
  movingCounter = 0;
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

function startGame(x = 10, y = 10, minesCount) {
  console.log(x, y, minesCount)
  sizeY = y;
  sizeX = x;
  mineCount = minesCount;
  openedCellCount = 0;
  gameOver = false;
  myBoard = board(sizeX, sizeY, mineCount);
  const fieldTag = document.createElement('div');
  fieldTag.classList.add('field');
  fieldTag.style.gridTemplateColumns = ``;

  fieldTag.setAttribute('style', `grid-template-columns: repeat(${sizeY}, 1.5rem); grid-template-rows: repeat(${sizeX}, 1.5rem)`);

  for (let cell in myBoard) {
    let cellButton = document.createElement('button');
    cellButton.classList.add('button-cell');
    cellButton.id = cell;

    cellButton.addEventListener('contextmenu', e => {
      myBoard[cell].marked = !myBoard[cell].marked
      cellButton.classList.toggle('cell_marked')
    })

    cellButton.addEventListener('click', (event) => {
      movingCounter++;
      moveCounter.textContent = `Количество шагов ${movingCounter}`
      handleClick(myBoard[cell], cellButton);
      if (!isTimerStarted && !gameOver) {
        isTimerStarted = true;
        seconds = 0;
        minutes = 0;
        hours = 0;
        interval = setInterval(() => updateTime(seconds, minutes, hours), 1000);
      }
    });
    fieldTag.append(cellButton);
  }
  main.append(fieldTag, moveCounter);
}

startGame(10, 10, 10);

// startBtn.addEventListener('click', () => {
//   clearInterval(interval);
//   seconds = 0;
//   minutes = 0;
//   hours = 0;
//   isTimerStarted = false;
//   timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//
//   document.querySelector('.field').remove();
//   startGame(6, 6, 5);
// });



