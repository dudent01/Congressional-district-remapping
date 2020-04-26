package Gators.api;

import Gators.model.Demographic.Demographic;
import Gators.model.Precinct;
import Gators.service.PrecinctService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@CrossOrigin
@RequestMapping("api/precinct")
@RestController
public class PrecinctController {
    private final PrecinctService precinctService;

    @Autowired
    public PrecinctController(PrecinctService precinctService) {
        this.precinctService = precinctService;
    }

    @GetMapping(path = "/state/{stateAbbr}")
    public Set<Precinct> getPrecinctsByStateAbbr(@PathVariable String stateAbbr) {
        return precinctService.getPrecinctsByStateAbbr(stateAbbr);
    }

    @PatchMapping(path = "/{id1}/{id2}")
    public void addNeighborById(@PathVariable long id1, @PathVariable long id2) {
        precinctService.addNeighborById(id1, id2);
    }

    @GetMapping(path = "/{id}/demographic")
    public Demographic getDemographicById(@PathVariable long id) {
        return precinctService.getDemographicById(id);
    }

    @GetMapping(path = "/{id}/neighbors")
    public Set<Precinct> getNeighborsById(@PathVariable long id) {
        return precinctService.getNeighborsById(id);
    }
}
