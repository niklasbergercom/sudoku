package com.niklasberger.sudokubackend.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.niklasberger.sudokubackend.data.PublicSudokuData;
import com.niklasberger.sudokubackend.data.SudokuData;
import com.niklasberger.sudokubackend.repo.SudokuRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
public class GameController {

    @Autowired
    private SudokuRepo sudokuRepo;

    // TODO: remove
//    @CrossOrigin(origins = "*")
//    @PostMapping("/game/create-new-sudoku")
//    private ResponseEntity<SudokuData> createNewSudoku(
//            @RequestBody Map<String, Object> requestBody
//    ) {
//        String puzzleString = requestBody.get("puzzle").toString();
//        String solutionString = requestBody.get("solution").toString();
//        int difficulty = Integer.parseInt(requestBody.get("difficulty").toString());
//
//        SudokuData savedSudoku = sudokuRepo.save(new SudokuData(
//                difficulty,
//                puzzleString,
//                solutionString
//        ));
//
//        return new ResponseEntity<>(
//                savedSudoku,
//                HttpStatus.CREATED
//        );
//
//    }

    @PostMapping("/game/random-sudoku")
    private ResponseEntity<Object> random(
            @RequestBody Map<String, Object> requestBody
    ) {
        int difficulty = Integer.parseInt(requestBody.get("difficulty").toString());

        Optional<SudokuData> sudokuOpt = Optional.ofNullable(sudokuRepo.findRandomByDifficulty(difficulty));
        if (sudokuOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        PublicSudokuData publicSudoku = new PublicSudokuData(sudokuOpt.get());

        return new ResponseEntity<>(
                publicSudoku,
                HttpStatus.OK
        );

    }

    @PostMapping("/game/check-cell")
    private ResponseEntity<Object> checkCell(
            @RequestBody Map<String, Object> requestBody
    ) {
        String id = requestBody.get("id").toString();
        int guess = Integer.parseInt(requestBody.get("guess").toString());
        int row = Integer.parseInt(requestBody.get("row").toString());
        int col = Integer.parseInt(requestBody.get("col").toString());

        Optional<SudokuData> sudokuOpt = sudokuRepo.findById(id);
        if (sudokuOpt.isEmpty()) {
            return new ResponseEntity<>(
                    "Sudoku not found",
                    HttpStatus.NOT_FOUND
            );
        }
        SudokuData sudoku = sudokuOpt.get();

        JsonArray solutionArray = new Gson().fromJson(sudoku.getSolution(), JsonArray.class);

        if (solutionArray.get(row - 1).getAsJsonArray().get(col - 1).getAsInt() == guess) {
            return new ResponseEntity<>(
                    "Guess correct",
                    HttpStatus.OK
            );
        }

        return new ResponseEntity<>(
                "Guess incorrect",
                HttpStatus.OK
        );
    }

    @PostMapping("/game/check-solution")
    private ResponseEntity<Object> checkSolution(
            @RequestBody Map<String, Object> requestBody
    ) {
        String id = requestBody.get("id").toString();
        JsonArray solutionToCheck = new Gson().fromJson(requestBody.get("solution").toString(), JsonArray.class);

        Optional<SudokuData> sudokuOpt = sudokuRepo.findById(id);
        if (sudokuOpt.isEmpty()) {
            return new ResponseEntity<>(
                    "Invalid ID",
                    HttpStatus.BAD_REQUEST
            );
        }
        JsonArray realSolution = new Gson().fromJson(sudokuOpt.get().getSolution(), JsonArray.class);

        if (Objects.equals(solutionToCheck.toString(), realSolution.toString())) {
            return new ResponseEntity<>(
                    "Solution correct",
                    HttpStatus.OK
            );
        }
        return new ResponseEntity<>(
                "Solution incorrect",
                HttpStatus.OK
        );
    }

}
