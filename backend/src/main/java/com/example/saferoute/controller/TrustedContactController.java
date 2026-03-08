package com.example.saferoute.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.saferoute.dto.TrustedContactDto;

@RestController
@CrossOrigin(origins = "*")
public class TrustedContactController {

    private final List<TrustedContactDto> contacts = new ArrayList<>(List.of(
            new TrustedContactDto("c-1", "Mum", "+447700900001", "mum@example.com"),
            new TrustedContactDto("c-2", "Best Friend", "+447700900002", null)
    ));

    @GetMapping("/contacts")
    public List<TrustedContactDto> getContacts() {
        return contacts;
    }

    @PostMapping("/contacts")
    public TrustedContactDto addContact(@RequestBody TrustedContactDto contact) {
        contact.setId(UUID.randomUUID().toString());
        contacts.add(contact);
        return contact;
    }

    @DeleteMapping("/contacts/{id}")
    public Map<String, Boolean> deleteContact(@PathVariable String id) {
        contacts.removeIf(c -> c.getId().equals(id));
        return Map.of("ok", true);
    }
}
