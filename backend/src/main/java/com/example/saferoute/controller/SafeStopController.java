package com.example.saferoute.controller;

import com.example.saferoute.dto.CreateSafeStopRequest;
import com.example.saferoute.model.SafeStop;
import com.example.saferoute.service.SafeStopService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/safe-stops")
@CrossOrigin(origins = "*")
public class SafeStopController {

    private final SafeStopService safeStopService;

    public SafeStopController(SafeStopService safeStopService) {
        this.safeStopService = safeStopService;
    }

    @GetMapping
    public List<SafeStop> getAll() {
        return safeStopService.getAll();
    }

    @PostMapping
    public SafeStop create(@Valid @RequestBody CreateSafeStopRequest request) {
        return safeStopService.create(request);
    }
}