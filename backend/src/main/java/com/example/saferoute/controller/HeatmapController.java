package com.example.saferoute.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.saferoute.dto.HeatmapPointDto;

@RestController
@CrossOrigin(origins = "*")
public class HeatmapController {

    @GetMapping("/heatmap")
    public List<HeatmapPointDto> getHeatmapData(
            @RequestParam(required = false) Double north,
            @RequestParam(required = false) Double south,
            @RequestParam(required = false) Double east,
            @RequestParam(required = false) Double west
    ) {
        return List.of(
                new HeatmapPointDto(51.5080, -0.1290, 0.8),
                new HeatmapPointDto(51.5065, -0.1310, 0.6),
                new HeatmapPointDto(51.5100, -0.1250, 0.4),
                new HeatmapPointDto(51.5045, -0.1350, 0.7),
                new HeatmapPointDto(51.5120, -0.1200, 0.3)
        );
    }
}
