let sudokuBoard = document.getElementById("sudoku-board");
let currentCell = {row: 0, col: 0}

for (let i = 0; i < 9; i++) {
    let rowElement = document.createElement("div");
    rowElement.id = "board-" + (i + 1);
    for (let j = 0; j < 9; j++) {
        let cellElement = `<div id="board-${i + 1}-${j + 1}" onclick="cellClick(${i + 1}, ${j + 1})"></div>`
        rowElement.innerHTML += cellElement;
    }
    sudokuBoard.appendChild(rowElement);
}

fetch("/assets/sudokus/easy/easy1.json")
.then(response => response.json()).then(json => {
    for (let i = 0; i < json.length; i++) {
        let jsonRow = json[i];
        for (let j = 0; j < jsonRow.length; j++) {
            let jsonCell = jsonRow[j];
            let htmlCell = document.getElementById("board-" + (i + 1) + "-" + (j + 1));
            if (jsonCell !== 0) {
                htmlCell.innerHTML = jsonCell;
                htmlCell.addEventListener("click", () => cellClick((i + 1), (j + 1)));
            } else {
                try {
                    htmlCell.classList.add("board-cell-empty");
                } catch (e) {
                    console.warn(e);
                    console.log("Error with element: " + i + " " + j);
                }
                
            }
        }
    }
})

document.addEventListener('keydown', function(event) {
    if (/^[1-9]$/.test(event.key)) {
        enterNumber(event.key);
    }
});

function isCellSelected() {
    return !(currentCell.col === 0 && currentCell.row === 0);
}

function getCurrentCell() {
    if (isCellSelected()) {
        return getCell(currentCell.row, currentCell.col)
    }
    return false;
}

function getCell(row, col) {
    return document.getElementById("board-" + row + "-" + col);
}

function resetCellHighlights() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            getCell(i + 1, j + 1).classList.remove("board-cell-selected");
            getCell(i + 1, j + 1).classList.remove("board-cell-highlighted");
        }
    }
}

function cellClick(row, col) {
    let cellElement = getCell(row, col);
    if (cellElement.classList.contains("board-cell-empty")) {
        if (isCellSelected()) {
            resetCellHighlights();
        }
        currentCell.row = row;
        currentCell.col = col;

        cellElement.classList.add("board-cell-selected");
        
        // Highlight column of cell
        for (let i = 0; i < 9; i++) {
            if ((i + 1) !== currentCell.row) {
                getCell((i + 1), currentCell.col).classList.add("board-cell-highlighted");
            }
        }
        
        // Highlight row of cell
        for (let i = 0; i < 9; i++) {
            if ((i + 1) !== currentCell.col) {
                getCell(currentCell.row, (i + 1)).classList.add("board-cell-highlighted");
            }
        }
        
    }
}

function enterNumber(num) {
    if (isCellSelected()) {
        getCurrentCell().innerHTML = num;
    }
}