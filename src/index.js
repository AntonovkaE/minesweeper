let gameOver = false;

function cell(row, column, isOpened, marked, mined, minesCount) {
  return {
    id: row + '-' + column,
    row,
    column,
    isOpened,
    marked,
    mined,
    minesCount,
  };
}

function board(sizeX, sizeY, mineCount) {
  let field = {};
  for (let row = 0; row <= sizeX; row++) {
    for (let col = 0; col <= sizeY; col++) {
      field[row + '' + col] = cell(row, col, false, false, false, 0);
    }
    field = setMines(field, mineCount);
    field = calcNeighbors(field, sizeY, sizeX);
  }
}

const getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

function getRandomCoors(sizeX, sizeY) {
  let randomRow = getRandomInteger(0, sizeX);
  let randomColumn = getRandomInteger(0, sizeY);
  return randomRow + '' + randomColumn;
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

const calcNeighbors = function (field, sizeX, sizeY) {
  let cell;
  let neighborMineCount = 0;
  for (let row = 0; row < sizeX; row++) {
    for (let column = 0; column < sizeY; column++) {
      let id = row + '-' + column;
      cell = field[id];
      if (!cell.mined) {
        let neighbors = getNeighbors(id);
        neighborMineCount = 0;
        for (let i = 0; i < neighbors.length; i++) {
          neighborMineCount += isMined(field, neighbors[i]);
        }
        cell.minesCount = neighborMineCount;
      }
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
    if (neighbors[i].length > 2) {
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
}

const handleClick = function (id) {
  if (!gameOver) {
    if (isSetFlag(event)) {
      setFlag(id);
    } else {
      const cell = board[id];
      if (!cell.opened && !cell.marked) {
        if (cell.mined) {
          // игра проиграна
          loss();
        } else {
          //открываем ячейку
          cell.opened = true;
          if (cell.minesCount > 0) {
          //  добавляем на ячейку количество бобм по соседству
          } else {
            //если по соседству нет бомб
            const neighbors = getNeighbors(id);
            neighbors.forEach(neighbor => {
              if (typeof board[neighbor] !== 'undefined' && !board[neighbor].marked && !board[neighbor].opened) {
                handleClick(neighbor)
              }
            })
          }
        }
      }
    }
  }
};
