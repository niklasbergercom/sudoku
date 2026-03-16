<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sudoku</title>
    <link rel="stylesheet" href="assets/css/general.css">
</head>
<body>
    <div id="menu-wrapper">
        <div id="menu">
            <ul>
                <li><a href="/">Standard Sudoku</a></li>
                <li><a href="/challenge">Start Challenge</a></li>
            </ul>
        </div>
    </div>
    <header>
        <div>Sudoku</div>
        <div id="menu-button">
            <img src="/assets/icon/bars-solid-full.svg" alt="Menu Icon" title="Open Menu" onclick="toggleMenu()">
        </div>
    </header>
    <div id="difficulty-selector">
        Difficulty:
        <ul>
            <li onclick="setGameMode(0)" id="difficulty-0">Easy</li>
            <li onclick="setGameMode(1)" id="difficulty-1">Medium</li>
            <li onclick="setGameMode(2)" id="difficulty-2">Hard</li>
            <li onclick="setGameMode(3)" id="difficulty-3">Very Hard</li>
        </ul>
    </div>
    <div id="sudoku-main">
        <div id="sudoku-stats">
            <div id="sudoku-timer">
                <img src="/assets/icon/stopwatch-solid-full-ffffff.svg" alt="Timer" title="Time spent on this Sudoku">
                <span id="sudoku-timer-value"><span id="sudoku-timer-value-h">0</span><span id="sudoku-timer-value-h-label">h</span><span id="sudoku-timer-value-m">0</span><span id="sudoku-timer-value-m-label">m</span><span id="sudoku-timer-value-s">0</span>s</span>
            </div>
            <div id="sudoku-points">
                <img src="/assets/icon/medal-solid-full-ffffff.svg" alt="Points" title="Points for this Sudoku">
                <span id="sudoku-points-value">0</span>
            </div>
            <div id="sudoku-mistakes">
                <img src="/assets/icon/circle-xmark-regular-full-ffffff.svg" alt="Mistakes" title="Mistakes">
                <span id="sudoku-mistakes-value">0</span>
            </div>
        </div>
        <div id="sudoku-board">
        </div>
        <div id="sudoku-keypad">
            <div id="sudoku-controls">
                <div onclick="undoLast()"><img src="/assets/icon/rotate-left-solid-full-ffffff.svg" alt="Undo [CTRL + Z]" title="Undo [CTRL + Z]"></div>
                <div onclick="toggleNotes()" id="toggle-notes"><img src="/assets/icon/pencil-solid-full-ffffff.svg" alt="Turn Notes on [N]" title="Turn Notes on [N]"></div>
                <div onclick="enterNumber('0')"><img src="/assets/icon/eraser-solid-full-ffffff.svg" alt="Erase current cell [DEL]" title="Erase current cell [DEL]"></div>
            </div>
            <div id="sudoku-numbers">
                <div onclick="enterNumber(1)" id="keypad-1" title="Enter '1'">1</div>
                <div onclick="enterNumber(2)" id="keypad-2" title="Enter '2'">2</div>
                <div onclick="enterNumber(3)" id="keypad-3" title="Enter '3'">3</div>
                <div onclick="enterNumber(4)" id="keypad-4" title="Enter '4'">4</div>
                <div onclick="enterNumber(5)" id="keypad-5" title="Enter '5'">5</div>
                <div onclick="enterNumber(6)" id="keypad-6" title="Enter '6'">6</div>
                <div onclick="enterNumber(7)" id="keypad-7" title="Enter '7'">7</div>
                <div onclick="enterNumber(8)" id="keypad-8" title="Enter '8'">8</div>
                <div onclick="enterNumber(9)" id="keypad-9" title="Enter '9'">9</div>
            </div>
        </div>
    </div>
    <script src="./assets/js/game.js"></script>
</body>
</html>