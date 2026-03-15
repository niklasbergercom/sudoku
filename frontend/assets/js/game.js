let sudokuBoard = document.getElementById("sudoku-board");
let currentCell = {row: 0, col: 0}
let cellIsWritable = false;
let currentDifficulty = "";
let currentId = ""
let mistakes = 0;
let history = [];
let keydownDict = {}
let notesOn = false;
setGameMode(0);

document.addEventListener('keydown', function(event) {
    if (["control", "z"].includes(event.key.toLowerCase())) {
        keydownDict[event.key.toLowerCase()] = true;
        if (keydownDict["control"] && keydownDict["z"]) {
            undoLast();
        }
    } else if (["Backspace", "Delete"].includes(event.key)) {
        enterNumber("0")
    } else if (/^[0-9]$/.test(event.key)) {
        enterNumber(event.key);
    } else if (event.key.toLowerCase() === "n") {
        toggleNotes();
    }
});

document.addEventListener('keyup', function(event) {
    delete keydownDict[event.key.toLowerCase()]
})

window.addEventListener('blur', function() {
    for (let i = 0; i < keydownDict.length; i++) {
        delete keydownDict.at(i);
    }
})

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
            getCell(i + 1, j + 1).classList.remove("board-cell-highlighted-same-num");
        }
    }
}

function cellClick(row, col) {
    let cellElement = getCell(row, col);
    cellIsWritable = cellElement.classList.contains("board-cell-empty");
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

    // Highlight same number
    const currentNum = cellElement.innerHTML;
    if (currentNum === "") return;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (getCell(i + 1, j + 1).innerHTML === currentNum && (i + 1 !== currentCell.row && j + 1 !== currentCell.col)) {
                getCell(i + 1, j + 1).classList.add("board-cell-highlighted-same-num")
            }
        }
    }
}

function enterNumber(num, skipHistory = false, skipCellCheck = false) {
    if (cellIsWritable) {
        
        if (notesOn && !/^[1-9]$/.test(getCurrentCell().innerHTML)) {
            if (!getCurrentCell().classList.contains("board-cell-notes")) {
                getCurrentCell().classList.add("board-cell-notes");
                getCurrentCell().innerHTML = `
                <div></div>
                <div></div>
                <div></div>
                
                <div></div>
                <div></div>
                <div></div>
                
                <div></div>
                <div></div>
                <div></div>
            `
            }
            getCurrentCell().children[parseInt(num) - 1].innerHTML = getCurrentCell().children[parseInt(num) - 1].innerHTML === num ? "" : num;
            return;
        } else if (notesOn && /^[1-9]$/.test(getCurrentCell().innerHTML)) {
            return;
        }
        if (!skipHistory && getCurrentCell().classList.contains("board-cell-notes")) {
            history.push({
                cell: {
                    row: currentCell.row,
                    col: currentCell.row
                },
                oldNum: "0",
                newNum: num
            });
        } else if (!skipHistory) {
            history.push({
                cell: {
                    row: currentCell.row,
                    col: currentCell.col
                },
                oldNum: (getCurrentCell().innerHTML === "") ? "0" : getCurrentCell().innerHTML,
                newNum: num
            });
        }

        getCurrentCell().classList.remove("board-cell-incorrect");
        getCurrentCell().classList.remove("board-cell-notes");

        if (num === "0") {
            getCurrentCell().innerHTML = "";
            return;
        }
        getCurrentCell().innerHTML = num;
        cellClick(currentCell.row, currentCell.col);
        if (skipCellCheck) {
            checkForWin();
            return;
        }
        fetch("/api/game/check-cell", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: currentId,
                guess: num,
                row: currentCell.row,
                col: currentCell.col
            })
        }).then(response => {
            if (response.ok) {
                response.text().then(text => {
                    if (text === "Guess incorrect") {
                        getCurrentCell().classList.add("board-cell-incorrect")
                        mistakes++;
                    } else if (text === "Guess correct") {
                        checkForWin()
                    }
                })
            }
        })
    }
}

function newGame() {
    fetch("/api/game/random-sudoku", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            difficulty: currentDifficulty
        })
    }).then(response => {
        if (!response.ok) {
            // TODO: handle error reporting to user
            console.error("Error while trying to fetch Sudoku");
            return;
        }
        response.json().then(json => {
            currentId = json.id;
            let puzzleJson = JSON.parse(json.puzzle);

            sudokuBoard.innerHTML = "";

            for (let i = 0; i < 9; i++) {
                let rowElement = document.createElement("div");
                rowElement.id = "board-" + (i + 1);
                for (let j = 0; j < 9; j++) {
                    let cellElement = `<div id="board-${i + 1}-${j + 1}" onclick="cellClick(${i + 1}, ${j + 1})"></div>`
                    rowElement.innerHTML += cellElement;
                }
                sudokuBoard.appendChild(rowElement);
            }

            for (let i = 0; i < puzzleJson.length; i++) {
                let jsonRow = puzzleJson[i];
                for (let j = 0; j < jsonRow.length; j++) {
                    let jsonCell = jsonRow[j];
                    let htmlCell = document.getElementById("board-" + (i + 1) + "-" + (j + 1));
                    htmlCell.addEventListener("click", () => cellClick((i + 1), (j + 1)));
                    if (jsonCell !== 0) {
                        htmlCell.innerHTML = jsonCell;
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
    })
}

function setGameMode(difficulty) {
    for (let i = 0; i < document.getElementsByClassName("difficulty-selected").length; i++) {
        document.getElementsByClassName("difficulty-selected")[i].classList.remove("difficulty-selected");
    }
    document.getElementById("difficulty-" + difficulty.toString()).classList.add("difficulty-selected");
    currentDifficulty = difficulty;
    newGame();
}

function checkForWin() {
    let allCellsFilled = true;
    let numCounter = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0};
    let solution = []
    for (let i = 0; i < 9; i++) {
        let solutionRow = []
        for (let j = 0; j < 9; j++) {
            let thisCell = getCell(i + 1, j + 1)
            if (thisCell.innerHTML === "") allCellsFilled = false;
            if (thisCell.innerHTML !== "") numCounter[thisCell.innerHTML] += 1;
            if (allCellsFilled) solutionRow.push(parseInt(thisCell.innerHTML));
        }
        if (allCellsFilled) solution.push(solutionRow);
    }
    for (let i = 1; i < 10; i++) {
        if (numCounter[i] === 9 && document.getElementById("keypad-" + (i)).innerHTML === (i).toString()) {
            document.getElementById("keypad-" + (i)).innerHTML = `
                    <img src="/assets/icon/check-solid-full-ffffff.svg" alt="All done!" title="All done!">
            `;
        }
    }
    if (!allCellsFilled) return;
    fetch("/api/game/check-solution", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            solution: solution,
            id: currentId
        })
    }).then(response => {
        if (response.ok) {
            response.text().then(text => {
                if (text === "Solution correct") {
                    // TODO: show a real message to user, not just alert
                    alert("Solved with " + mistakes + " mistakes");
                }
            })
        }
    })
}

function undoLast() {
    if (history.length === 0) return;
    cellClick(history.at(-1).cell.row, history.at(-1).cell.col);
    enterNumber(history.at(-1).oldNum, true, true);
    history.pop();
}

function toggleNotes() {
    notesOn = !notesOn;
    document.getElementById("toggle-notes").children[0].alt = notesOn ? "Turn Notes off [N]" : "Turn Notes on [N]";
    document.getElementById("toggle-notes").children[0].title = notesOn ? "Turn Notes off [N]" : "Turn Notes on [N]";
    document.getElementById("toggle-notes").style.backgroundColor = notesOn ? "var(--color-background-selected)" : "unset";
}