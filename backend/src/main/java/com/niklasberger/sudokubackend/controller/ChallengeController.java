package com.niklasberger.sudokubackend.controller;

import com.niklasberger.sudokubackend.data.ChallengeData;
import com.niklasberger.sudokubackend.data.PublicChallengeData;
import com.niklasberger.sudokubackend.data.SudokuData;
import com.niklasberger.sudokubackend.repo.ChallengeRepo;
import com.niklasberger.sudokubackend.repo.SudokuRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
public class ChallengeController {

    @Autowired
    private SudokuRepo sudokuRepo;

    @Autowired
    private ChallengeRepo challengeRepo;

    @PostMapping("/challenge/start-new")
    public ResponseEntity<Object> startNewChallenge(
            @RequestBody Map<String, Object> requestBody
    ) {

        Integer difficulty = Integer.parseInt(requestBody.getOrDefault("difficulty", "1").toString());

        SudokuData sudoku = sudokuRepo.findRandomByDifficulty(difficulty);

        ChallengeData challenge = challengeRepo.save(new ChallengeData(
                sudoku.getId()
        ));

        return new ResponseEntity<>(
                new PublicChallengeData(challenge, "host"),
                HttpStatus.OK
        );

    }

    @PostMapping("/challenge/join")
    public ResponseEntity<Object> joinChallenge(
            @RequestBody Map<String, Object> requestBody
    ) {

        String sessionUuid = requestBody.get("session").toString();

        Optional<ChallengeData> challengeOpt = challengeRepo.findById(sessionUuid);

        if (challengeOpt.isEmpty()) {
            return new ResponseEntity<>(
                    "Challenge not found",
                    HttpStatus.BAD_REQUEST
            );
        }

        return new ResponseEntity<>(
                new PublicChallengeData(challengeOpt.get(), "guest"),
                HttpStatus.OK
        );

    }

}
