package Gators.service;

import Gators.model.State;
import Gators.repository.Repositories;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class StateService {
    public Set<State> getAllStates() {
        return new HashSet<>(Repositories.stateRepository.findAll());
    }

    public State getStateById(long id) {
        return Repositories.stateRepository.findById(id).orElse(null);
    }

    public State getStateByAbbr(String abbr) {
        return Repositories.stateRepository.findByAbbr(abbr);
    }
}
