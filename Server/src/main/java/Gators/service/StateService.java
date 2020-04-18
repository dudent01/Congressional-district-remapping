package Gators.service;

import Gators.model.State;
import Gators.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StateService
{
    private final StateRepository stateRepository;

    @Autowired
    public StateService(StateRepository stateRepository)
    {
        this.stateRepository = stateRepository;
    }

    public void addState(State state)
    {
        stateRepository.save(state);
    }

    public List<State> getAllStates()
    {
        return (List<State>) stateRepository.findAll();
    }

    public State getStateById(long id)
    {
        return stateRepository.findById(id).orElse(null);
    }
}
