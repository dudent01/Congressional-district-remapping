package com.gators.precinctmap.controller;

import com.gators.precinctmap.Greeting;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/precinct")
public class PrecinctController {
    private PrecinctRepository precinctRepository;
    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping("")
    String get() {
        //mapped to hostname:port/home/
        return "Hello from get";
    }
}
