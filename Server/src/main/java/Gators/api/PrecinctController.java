package Gators.api;

import Gators.model.Precinct;
import Gators.service.PrecinctService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

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

    @PostMapping
    public void addPrecinct(@Valid @NotNull @RequestBody Precinct precinct)
    {
        precinctService.add(precinct);
    }

    @GetMapping
    public List<Precinct> getAllPrecincts()
    {
        return precinctService.getAll();
    }

    @GetMapping(path = "{abbrName}")
    public Precinct getPrecinctByAbbrName(@PathVariable("abbrName") String abbrName)
    {
        return precinctService.getByAbbrName(abbrName).orElse(null);
    }

    @DeleteMapping(path = "{abbrName}")
    public void deletePrecinctByAbbrName(@PathVariable("abbrName") String abbrName)
    {
        precinctService.deleteByAbbrName(abbrName);
    }

    @PutMapping(path = "{abbrName}")
    public void updatePrecinctByAbbrName(@PathVariable("abbrName") String abbrName, @Valid @NotNull @RequestBody Precinct precinct)
    {
        precinctService.updateByAbbrName(abbrName, precinct);
    }
}
