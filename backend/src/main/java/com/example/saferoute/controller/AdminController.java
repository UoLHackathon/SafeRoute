package com.example.saferoute.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.saferoute.dto.IncidentReportDto;
import com.example.saferoute.dto.SafeStopDto;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @GetMapping("/incidents")
    public List<IncidentReportDto> getIncidents() {
        return List.of(
                new IncidentReportDto("r-1", 51.5080, -0.1290, "poorly_lit", "2026-03-07T22:15:00Z", "Dark alley near the station"),
                new IncidentReportDto("r-2", 51.5065, -0.1310, "harassment", "2026-03-07T21:30:00Z", "Verbal harassment reported"),
                new IncidentReportDto("r-3", 51.5100, -0.1250, "isolated_street", "2026-03-06T23:00:00Z", "Very few people after 11pm")
        );
    }

    @GetMapping("/safe-stops")
    public List<SafeStopDto> getSafeStops() {
        return List.of(
                new SafeStopDto("ss-1", "Boots Pharmacy", "pharmacy", 51.5082, -0.1300),
                new SafeStopDto("ss-2", "St Thomas' Hospital", "hospital", 51.4988, -0.1189),
                new SafeStopDto("ss-3", "Charing Cross Police Station", "police", 51.5074, -0.1260),
                new SafeStopDto("ss-4", "Tesco Express — Strand", "late_open_shop", 51.5098, -0.1220)
        );
    }

    @PostMapping("/seed")
    public Map<String, String> seedData() {
        return Map.of("message", "Sample data seeded successfully");
    }
}
