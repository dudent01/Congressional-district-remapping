package Gators.api;

import Gators.model.Demographic.Demographic;
import Gators.model.Precinct;
import Gators.model.Territory;
import Gators.service.PrecinctService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

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
    public boolean addNeighborById(@PathVariable long id1, @PathVariable long id2) {
        precinctService.addNeighborById(id1, id2);
        return true;
    }

    @GetMapping(path = "/{id}/demographic")
    public Demographic getDemographicById(@PathVariable long id) {
        return precinctService.getDemographicById(id);
    }

    @GetMapping(path = "/{id}/neighbors")
    public Set<Long> getNeighborsById(@PathVariable long id) {
        return precinctService.getNeighborsById(id).stream().map(Territory::getId).collect(Collectors.toSet());
    }

    @GetMapping(path = "/{id}/presidential2016")
    public Collection getPresidentialElectionAndDemographicById(@PathVariable long id) {
        return precinctService.getPres2016AndDemographicById(id);
    }

    @PutMapping(path = "/{id}/geojson")
    public boolean editGeojsonById(@PathVariable long id, @RequestBody String geojson) {
        precinctService.editGeojsonById(id, geojson);
        return true;
    }

    @DeleteMapping(path = "/{id1}/{id2}")
    public boolean deleteNeighborById(@PathVariable long id1, @PathVariable long id2) {
        precinctService.deleteNeighborById(id1, id2);
        return true;
    }

    @PatchMapping(path = "/{id1}/{id2}/merge")
    public Precinct mergePrecinctsById(@PathVariable long id1, @PathVariable long id2) {
        return precinctService.mergePrecinctsById(id1, id2);
    }
}
