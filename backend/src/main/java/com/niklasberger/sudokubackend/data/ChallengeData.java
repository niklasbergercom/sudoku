package com.niklasberger.sudokubackend.data;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
public class ChallengeData {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String sessionHost;
    private String sessionGuest;
    private Integer stage;
    private String sudokuId;
    private Timestamp startTime;
    private Timestamp finishedHost;
    private Timestamp finishedGuest;
    private Timestamp expires;

    public ChallengeData(String sudokuId) {
        this.sudokuId = sudokuId;
        this.stage = 1;
        this.sessionHost = UUID.randomUUID().toString();
        this.sessionGuest = UUID.randomUUID().toString();
        this.expires = new Timestamp(System.currentTimeMillis() + 1000 * 60 * 60 * 24);
    }

}
