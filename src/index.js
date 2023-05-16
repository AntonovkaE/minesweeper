let gameOver = false;
let sizeX = 10;
let sizeY = 10;
let openedCellCount = 0;
let mineCount = 1;

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

const setFlag = function (id) {

  // установить флаг
};

function isSetFlag(event) {
  return false;
//  проверить событие содержит ли contextmenu
}

function loss() {
  gameOver = true;
  alert('Game over. Try again');
}

function win() {
  alert('Hooray! You found all mines in ## seconds and N moves!');
}

const handleClick = function (cell, cellButton) {
  if (!gameOver) {
    if (!cell.opened && !cell.marked) {
      if (cell.mined) {
        loss();
      } else {
        cellButton.classList.add('button-cell_opened');
        openedCellCount++;
        console.log(openedCellCount, mineCount, sizeY*sizeY)
        if ((sizeY * sizeY - mineCount - openedCellCount) == 0) {
          win();
          return;
        }
        //открываем ячейку
        cell.opened = true;
        if (cell.minesCount > 0) {
          cellButton.textContent = cell.minesCount;
          //  добавляем на ячейку количество бобм по соседству
        } else {
          //если по соседству нет бомб
          const neighbors = getNeighbors(cell.id);
          neighbors.forEach(neighbor => {
            if (typeof board[neighbor] !== 'undefined' && !board[neighbor].marked && !board[neighbor].opened) {
              handleClick(neighbor);
            }
          });
        }
      }
    }
  }
};

function startGame (x = 10, y, minesCount) {
  console.log(mineCount, 'df')
  sizeY = y;
  sizeX = x
  mineCount = minesCount
  openedCellCount = 0;
  gameOver = false;
  let myBoard = board(sizeX, sizeY, mineCount);
  const fieldTag = document.createElement('div');
  fieldTag.classList.add('field');
  fieldTag.style.gridTemplateColumns = ``;

  fieldTag.setAttribute('style', `grid-template-columns: repeat(${sizeY}, 20px); grid-template-rows: repeat(${sizeX}, 20px)`);

  for (let cell in myBoard) {
    let cellButton = document.createElement('button');
    cellButton.classList.add('button-cell');

    cellButton.addEventListener('click', (event) => {
      handleClick(myBoard[cell], cellButton);
    });
    fieldTag.append(cellButton);
  }
  document.querySelector('body').append(fieldTag);
}

startGame(3, 3, 1)






