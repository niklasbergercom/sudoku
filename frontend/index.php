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
    <header>Sudoku</header>
    <div id="difficulty-selector">
        Difficulty:
        <ul>
            <li class="difficulty-selected">Easy</li>
            <li>Medium</li>
            <li>Hard</li>
            <li>Very Hard</li>
        </ul>
    </div>
    <div id="sudoku-main">
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