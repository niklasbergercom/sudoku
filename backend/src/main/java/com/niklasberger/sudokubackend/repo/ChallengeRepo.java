package com.niklasberger.sudokubackend.repo;

import com.niklasberger.sudokubackend.data.ChallengeData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeRepo extends JpaRepository<ChallengeData, String> {
}
