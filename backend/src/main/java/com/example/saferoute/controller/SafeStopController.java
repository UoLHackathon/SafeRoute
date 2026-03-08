package com.example.saferoute.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.saferoute.dto.SafeStopDto;

@RestController
@CrossOrigin(origins = "*")
public class SafeStopController {

    private final List<SafeStopDto> safeStops = new ArrayList<>(List.of(
            new SafeStopDto("ss-1", "Boots Pharmacy", "pharmacy", 51.5082, -0.1300),
            new SafeStopDto("ss-2", "St Thomas' Hospital", "hospital", 51.4988, -0.1189),
            new SafeStopDto("ss-3", "Charing Cross Police Station", "police", 51.5074, -0.1260),
            new SafeStopDto("ss-4", "Tesco Express — Strand", "late_open_shop", 51.5098, -0.1220),
            new SafeStopDto("ss-5", "Superdrug Pharmacy", "pharmacy", 51.5110, -0.1345),
            new SafeStopDto("ss-6", "Guy's Hospital", "hospital", 51.5035, -0.0873),
            new SafeStopDto("ss-7", "West End Central Police", "police", 51.5133, -0.1390),
            new SafeStopDto("ss-8", "Sainsbury's Local — Victoria", "late_open_shop", 51.4965, -0.1440)
    ));

    @GetMapping("/safe-stops/all")
    public List<SafeStopDto> getAllSafeStops(@RequestParam(required = false) String category) {
        if (category == null || category.isEmpty()) {
            return safeStops;
        }
        return safeStops.stream()
                .filter(s -> s.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    @GetMapping("/safe-stops")
    public List<SafeStopDto> getSafeStopsForRoute(@RequestParam(required = false) String routeId) {
        return safeStops.subList(0, Math.min(4, safeStops.size()));
    }
}
