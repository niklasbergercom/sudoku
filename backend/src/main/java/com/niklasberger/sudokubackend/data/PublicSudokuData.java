package com.niklasberger.sudokubackend.data;

import lombok.Data;

@Data
public class PublicSudokuData {

    private String id;
    private Integer difficulty;
    private String puzzle;

    public PublicSudokuData(SudokuData sudoku) {
        this.id = sudoku.getId();
        this.difficulty = sudoku.getDifficulty();
        this.puzzle = sudoku.getPuzzle();
    }

}
