package Gators.api;

import Gators.model.State;
import Gators.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RequestMapping("api/state")
@RestController
public class StateController {
    private final StateService stateService;

    @Autowired
    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping
    public Set<State> getAllStates() {
        return stateService.getAllStates();
    }

    @GetMapping(path = "/{id}")
    public State getStateById(@PathVariable long id) {
        return stateService.getStateById(id);
    }

    @GetMapping(path = "/abbr/{abbr}")
    public State getStateByAbbr(@PathVariable String abbr) {
        return stateService.getStateByAbbr(abbr);
    }
}
