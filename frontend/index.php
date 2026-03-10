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
            <div onclick="enterNumber(1)" id="keypad-1"></div>
            <div onclick="enterNumber(2)" id="keypad-2"></div>
            <div onclick="enterNumber(3)" id="keypad-3"></div>
            <div onclick="enterNumber(4)" id="keypad-4"></div>
            <div onclick="enterNumber(5)" id="keypad-5"></div>
            <div onclick="enterNumber(6)" id="keypad-9"></div>
            <div onclick="enterNumber(7)" id="keypad-6"></div>
            <div onclick="enterNumber(8)" id="keypad-7"></div>
            <div onclick="enterNumber(9)" id="keypad-8"></div>
        </div>
    </div>
    <script src="./assets/js/game.js"></script>
</body>
</html>