package com.example.saferoute.service;

import com.example.saferoute.dto.CreateSafeStopRequest;
import com.example.saferoute.model.SafeStop;
import com.example.saferoute.repository.SafeStopRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SafeStopService {

    private final SafeStopRepository safeStopRepository;

    public SafeStopService(SafeStopRepository safeStopRepository) {
        this.safeStopRepository = safeStopRepository;
    }

    public List<SafeStop> getAll() {
        return safeStopRepository.findAll();
    }

    public SafeStop create(CreateSafeStopRequest request) {
        SafeStop safeStop = new SafeStop();
        safeStop.setName(request.getName());
        safeStop.setCategory(request.getCategory());
        safeStop.setLatitude(request.getLatitude());
        safeStop.setLongitude(request.getLongitude());
        safeStop.setOpensAt(request.getOpensAt());
        safeStop.setClosesAt(request.getClosesAt());
        safeStop.setis_24Hours(Boolean.TRUE.equals(request.getIs24Hours()));
        return safeStopRepository.save(safeStop);
    }
}
