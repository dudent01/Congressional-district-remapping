package Gators.service;

import Gators.model.State;
import Gators.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class StateService {
    private final StateRepository stateRepository;

    @Autowired
    public StateService(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    public Set<State> getAllStates() {
        return new HashSet<>(stateRepository.findAll());
    }

    public State getStateById(long id) {
        return stateRepository.findById(id).orElse(null);
    }

    public State getStateByAbbr(String abbr) {
        return stateRepository.findByAbbr(abbr);
    }
}
