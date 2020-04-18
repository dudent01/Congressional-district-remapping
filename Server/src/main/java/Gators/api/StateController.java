package Gators.api;

import Gators.model.State;
import Gators.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/state")
@RestController
public class StateController
{
    private StateService stateService;

    @Autowired
    public StateController(StateService stateService)
    {
        this.stateService = stateService;
    }

    @PostMapping
    public void addState(@RequestBody State state)
    {
        stateService.addState(state);
    }

    @GetMapping
    public List<State> getAllStates()
    {
        return stateService.getAllStates();
    }

    @GetMapping(path = "{id}")
    public State getStateById(@PathVariable long id)
    {
        return stateService.getStateById(id);
    }
}
