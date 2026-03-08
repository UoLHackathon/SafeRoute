package com.example.saferoute.controller;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.saferoute.dto.WalkSessionDto;

@RestController
@CrossOrigin(origins = "*")
public class WalkController {

    private final Map<String, WalkSessionDto> sessions = new ConcurrentHashMap<>();

    @PostMapping("/walk/start")
    public WalkSessionDto startWalk(@RequestBody Map<String, Object> body) {
        WalkSessionDto session = new WalkSessionDto();
        session.setId(UUID.randomUUID().toString());
        session.setRouteMode((String) body.getOrDefault("routeType", "LOWER_RISK"));
        session.setStartTime(Instant.now().toString());
        int minutes = body.containsKey("expectedMinutes")
                ? ((Number) body.get("expectedMinutes")).intValue()
                : 15;
        session.setExpectedArrival(Instant.now().plus(minutes, ChronoUnit.MINUTES).toString());
        session.setIsActive(true);
        sessions.put(session.getId(), session);
        return session;
    }

    @PostMapping("/walk/{sessionId}/checkin")
    public Map<String, Boolean> checkIn(@PathVariable String sessionId) {
        WalkSessionDto session = sessions.get(sessionId);
        if (session != null) {
            session.setLastCheckIn(Instant.now().toString());
        }
        return Map.of("ok", true);
    }

    @PostMapping("/walk/{sessionId}/end")
    public Map<String, Boolean> endWalk(@PathVariable String sessionId) {
        WalkSessionDto session = sessions.get(sessionId);
        if (session != null) {
            session.setIsActive(false);
        }
        return Map.of("ok", true);
    }
}
