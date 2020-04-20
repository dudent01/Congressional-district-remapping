package Gators.api;

import Gators.model.Precinct;
import Gators.model.State;
import Gators.service.PrecinctService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@CrossOrigin
@RequestMapping("api/precinct")
@RestController
public class PrecinctController
{
    private final PrecinctService precinctService;

    @Autowired
    public PrecinctController(PrecinctService precinctService)
    {
        this.precinctService = precinctService;
    }

    @GetMapping(path = "/state/{stateId}")
    public Set<Precinct> getPrecinctsByState(@PathVariable String stateId)
    {
        return precinctService.getPrecinctsByStateId(Long.parseLong(stateId));
    }

    @PatchMapping(path = "/{id1}/{id2}")
    public void addNeighborById(@PathVariable long id1, @PathVariable long id2)
    {
        precinctService.addNeighborById(id1, id2);
    }
}
