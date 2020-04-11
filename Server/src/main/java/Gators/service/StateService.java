package Gators.service;

import Gators.dao.StateAccess;
import Gators.model.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StateService implements TerritoryService<State>
{
    private final StateAccess stateAccess;

    @Autowired
    public StateService(@Qualifier("FakeStateAccess") StateAccess stateAccess)
    {
        this.stateAccess = stateAccess;
    }

    public int add(State state)
    {
        return stateAccess.add(state);
    }

    public List<State> getAll()
    {
        return stateAccess.getAll();
    }

    public Optional<State> getByAbbrName(String abbrName)
    {
        return stateAccess.getByAbbrName(abbrName);
    }

    public int deleteByAbbrName(String abbrName)
    {
        return stateAccess.deleteByAbbrName(abbrName);
    }

    public int updateByAbbrName(String abbrName, State state)
    {
        return stateAccess.updateByAbbrName(abbrName, state);
    }
}
