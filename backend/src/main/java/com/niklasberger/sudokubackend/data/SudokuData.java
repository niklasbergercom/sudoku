package com.niklasberger.sudokubackend.data;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
public class SudokuData {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private Integer difficulty;
    @Column(length = 500)
    private String puzzle;
    @Column(length = 500)
    private String solution;

    public SudokuData(Integer difficulty, String puzzle, String solution) {
        this.difficulty = difficulty;
        this.puzzle = puzzle;
        this.solution = solution;
    }

}
