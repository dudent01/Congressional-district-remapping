package Gators.api;

import Gators.model.State;
import Gators.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@RequestMapping("api/state")
@RestController
public class StateController
{
    private final StateService stateService;

    @Autowired
    public StateController(StateService stateService)
    {
        this.stateService = stateService;
    }

    @PostMapping
    public void addState(@Valid @NotNull @RequestBody State state)
    {
        stateService.add(state);
    }

    @GetMapping
    public List<State> getAllStates()
    {
        return stateService.getAll();
    }

    @GetMapping(path = "{abbrName}")
    public State getStateByAbbrName(@PathVariable("abbrName") String abbrName)
    {
        return stateService.getByAbbrName(abbrName).orElse(null);
    }

    @DeleteMapping(path = "{abbrName}")
    public void deleteStateByAbbrName(@PathVariable("abbrName") String abbrName)
    {
        stateService.deleteByAbbrName(abbrName);
    }

    @PutMapping(path = "{abbrName}")
    public void updateStateByAbbrName(@PathVariable("abbrName") String abbrName, @Valid @NotNull @RequestBody State state)
    {
        stateService.updateByAbbrName(abbrName, state);
    }
}
