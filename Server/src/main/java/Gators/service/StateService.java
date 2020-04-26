package Gators.service;

import Gators.model.State;
import Gators.repository.Repositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class StateService {
    private final Repositories repositories;

    @Autowired
    public StateService(Repositories repositories) {
        this.repositories = repositories;
    }

    public Set<State> getAllStates() {
        return new HashSet<>(repositories.getStateRepository().findAll());
    }

    public State getStateById(long id) {
        return repositories.getStateRepository().findById(id).orElse(null);
    }

    public State getStateByAbbr(String abbr) {
        return repositories.getStateRepository().findByAbbr(abbr);
    }
}
