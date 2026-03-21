package com.niklasberger.sudokubackend.data;

import lombok.Data;

import java.sql.Timestamp;
import java.util.Objects;

@Data
public class PublicChallengeData {

    private String id;
    private String session;
    private Timestamp startTime;
    private Timestamp finishedHost;
    private Timestamp finishedGuest;

    public PublicChallengeData(ChallengeData challenge, String recipient) {
        this.id = challenge.getId();
        this.startTime = challenge.getStartTime();
        this.finishedHost = challenge.getFinishedHost();
        this.finishedGuest = challenge.getFinishedGuest();
        if (Objects.equals(recipient, "host")) {
            this.session = challenge.getSessionHost();
        } else if (Objects.equals(recipient, "guest")) {
            this.session = challenge.getSessionGuest();
        }
    }

}
