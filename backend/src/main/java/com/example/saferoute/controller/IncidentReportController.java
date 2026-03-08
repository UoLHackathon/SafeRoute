package com.example.saferoute.controller;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.saferoute.dto.IncidentReportDto;

@RestController
@CrossOrigin(origins = "*")
public class IncidentReportController {

    private final List<IncidentReportDto> reports = new ArrayList<>(List.of(
            new IncidentReportDto("r-1", 51.5080, -0.1290, "poorly_lit", "2026-03-07T22:15:00Z", "Dark alley near the station"),
            new IncidentReportDto("r-2", 51.5065, -0.1310, "harassment", "2026-03-07T21:30:00Z", "Verbal harassment reported"),
            new IncidentReportDto("r-3", 51.5100, -0.1250, "isolated_street", "2026-03-06T23:00:00Z", "Very few people after 11pm")
    ));

    @GetMapping("/reports")
    public List<IncidentReportDto> getReports() {
        return reports;
    }

    @PostMapping("/reports")
    public IncidentReportDto submitReport(@RequestBody IncidentReportDto report) {
        report.setId(UUID.randomUUID().toString());
        if (report.getTimestamp() == null) {
            report.setTimestamp(Instant.now().toString());
        }
        reports.add(report);
        return report;
    }
}
