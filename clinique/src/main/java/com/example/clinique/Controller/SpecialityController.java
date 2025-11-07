package com.example.clinique.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.clinique.entities.Speciality;
import com.example.clinique.repository.SpecialityRepository;
import java.util.List;

// SpecialityController.java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // pour dev React
public class SpecialityController {

    @Autowired
    private SpecialityRepository specialityRepository;

    @GetMapping("/specialities")
    public List<Speciality> getAllSpecialities() {
        return specialityRepository.findAll();
    }
}
