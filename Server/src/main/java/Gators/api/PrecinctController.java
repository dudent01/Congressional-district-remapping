package Gators.api;

import Gators.model.Precinct;
import Gators.service.PrecinctService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class PrecinctController
{
    private final PrecinctService precinctService;

    @Autowired
    public PrecinctController(PrecinctService precinctService)
    {
        this.precinctService = precinctService;
    }

    @PostMapping
    public void addPrecinct(@RequestBody Precinct precinct)
    {
        precinctService.addPrecinct(precinct);
    }

//    TODO create method in service
//    @GetMapping(path = "{id}")
//    public Set<Precinct> getPrecinctByState()
//    {
//        return precinctService.getPrecinctByState();
//    }

}
