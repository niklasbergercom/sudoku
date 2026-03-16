let sudokuBoard = document.getElementById("sudoku-board");
let currentCell = {row: 0, col: 0}
let cellIsWritable = false;
let currentDifficulty = "";
let currentId = "";
let currentPoints = 0;
let mistakes = 0;
let history = [];
let keydownDict = {}
let notesOn = false;
let menuLock = false;
let gameStart = new Date();
gameStart.setFullYear(1990);

let rowsSolved = {};
let colsSolved = {};
let numsSolved = {};
let cellsSolved = {};

setGameMode(0);
setInterval(() => {updateTimer()}, 50);

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
                        document.getElementById("sudoku-mistakes-value").innerHTML = mistakes;
                    } else if (text === "Guess correct") {
                        if (cellsSolved[currentCell.row.toString() + currentCell.col.toString()] !== true) {
                            addPoints("cell");
                            cellsSolved[currentCell.row.toString() + currentCell.col.toString()] = true;
                        }
                        checkForWin();
                    }
                })
            }
        })
    }
}

function newGame() {
    mistakes = 0;
    currentPoints = 0;
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

            gameStart = new Date();
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
        let rowFull = true;
        for (let j = 0; j < 9; j++) {
            let thisCell = getCell(i + 1, j + 1)
            if (thisCell.innerHTML === "") {
                allCellsFilled = false;
                rowFull = false;
            }
            if (thisCell.innerHTML !== "") numCounter[thisCell.innerHTML] += 1;
            solutionRow.push(parseInt(thisCell.innerHTML));
        }
        if (rowFull && rowsSolved[i.toString()] !== true) {
            addPoints("row");
            rowsSolved[i.toString()] = true;
        }
        solution.push(solutionRow);
    }

    // Check if num is solved for points and keypad
    for (let i = 1; i < 10; i++) {
        if (numCounter[i] === 9) {
            if (numsSolved[i] !== true) {
                addPoints("num");
                numsSolved[i] = true;
            }
            if (document.getElementById("keypad-" + (i)).innerHTML === (i).toString()) {
                document.getElementById("keypad-" + (i)).innerHTML = `
                    <img src="/assets/icon/check-solid-full-ffffff.svg" alt="All done!" title="All done!">
            `;
            }
        }
    }

    // Check if col is solved for points
    for (let j = 0; j < 9; j++) {
        let colFull = true
        for (let i = 0; i < 9; i++) {
            if (isNaN(solution[i][j])) {
                colFull = false;
            }
        }
        if (colFull && colsSolved[j] !== true) {
            addPoints("col");
            colsSolved[j] = true;
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
                    gameStart.setFullYear(1990)
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

function updateTimer() {

    if (gameStart.getFullYear() < 2000) return;
    
    const hoursEl = document.getElementById("sudoku-timer-value-h");
    const hoursLabelEl = document.getElementById("sudoku-timer-value-h-label");
    const minutesEl = document.getElementById("sudoku-timer-value-m");
    const minutesLabelEl = document.getElementById("sudoku-timer-value-m-label");
    const secondsEl = document.getElementById("sudoku-timer-value-s");

    let now = new Date();
    let timeDifference = now - gameStart;
    let hours = Math.floor(timeDifference / (1000 * 60 * 60));
    let minutes = Math.floor(timeDifference / (1000 * 60)) - hours * 60;
    let seconds = Math.floor(timeDifference / 1000) - hours * 60 * 60 - minutes * 60;
    
    if (hours === 0) {
        hoursEl.style.display = "none";
        hoursLabelEl.style.display = "none";
    } else {
        hoursEl.style.display = "unset";
        hoursLabelEl.style.display = "unset";
        if (hoursEl.innerHTML !== hours.toString()) hoursEl.innerHTML = hours.toString();
    }
    
    if (minutes === 0) {
        minutesEl.style.display = "none";
        minutesLabelEl.style.display = "none";
    } else {
        minutesEl.style.display = "unset";
        minutesLabelEl.style.display = "unset";
        if (minutesEl.innerHTML !== minutes.toString()) minutesEl.innerHTML = minutes.toString();
    }
    
    if (secondsEl.innerHTML !== seconds.toString()) secondsEl.innerHTML = seconds.toString();

}

function addPoints(category) {
    const pointsEl = document.getElementById("sudoku-points-value");
    if (!pointsEl) return;

    const pointsToAdd = { col: 250, row: 250, num: 350, cell: 50, box: 300}[category];
    if (pointsToAdd === undefined) return;

    console.log("Adding " + pointsToAdd + " because of " + category);

    const startPoints = currentPoints;
    const targetPoints = currentPoints + pointsToAdd;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / 2000, 1);
        const value = Math.floor(startPoints + (targetPoints - startPoints) * progress);
        pointsEl.innerHTML = value.toString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            currentPoints = targetPoints;
            pointsEl.innerHTML = currentPoints.toString();
        }
    }

    requestAnimationFrame(update);
}

function toggleMenu(desiredState = "") {
    let currentState = !["none", ""].includes(document.getElementById("menu-wrapper").style.display);
    if ((desiredState === "open" || desiredState === "") && !currentState) {
        document.getElementById("menu-wrapper").style.display = "flex";
        setTimeout(() => {
            document.getElementById("menu-wrapper").style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            document.getElementById("menu").style.transform = "unset";  
        }, 1);
    } else if ((desiredState === "closed" || desiredState === "") && currentState) {
        document.getElementById("menu").style.transform = "translateX(350px)";
        document.getElementById("menu-wrapper").style.backgroundColor = "rgba(0, 0, 0, 0)";
        setTimeout(() => {
            document.getElementById("menu-wrapper").style.display = "none";
        }, 1000);
    }
}