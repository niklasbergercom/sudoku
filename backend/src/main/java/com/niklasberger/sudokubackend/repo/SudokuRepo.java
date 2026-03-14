package com.niklasberger.sudokubackend.repo;

import com.niklasberger.sudokubackend.data.SudokuData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SudokuRepo extends JpaRepository<SudokuData, String> {

    @Query(value = "SELECT * FROM sudoku_data WHERE difficulty = :difficulty ORDER BY RAND() LIMIT 1", nativeQuery = true)
    SudokuData findRandomByDifficulty(@Param("difficulty") Integer difficulty);

}
