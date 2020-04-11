package Gators.dao;

import Gators.model.State;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository("FakeStateAccess")
public class FakeStateAccess implements StateAccess
{
    private static List<State> statesList = new ArrayList<>();

    @Override
    public int add(State newState)
    {
        if (statesList.stream().anyMatch(state -> state.getAbbrName().equals(newState.getAbbrName())))
            return 0;
        statesList.add(newState);
        return 1;
    }

    @Override
    public List<State> getAll()
    {
        return statesList;
    }

    @Override
    public Optional<State> getByAbbrName(String abbrName)
    {
        return statesList.stream().filter(State -> State.getAbbrName().equals(abbrName)).findFirst();
    }

    @Override
    public int deleteByAbbrName(String abbrName)
    {
        Optional<State> state = getByAbbrName(abbrName);
        if (state.isEmpty())
            return 0;
        statesList.remove(state.get());
        return 1;
    }

    @Override
    public int updateByAbbrName(String abbrName, State state)
    {
        Optional<State> updatee = getByAbbrName(abbrName);
        if (updatee.isEmpty())
            return 0;

        int indexOfUpdatee = statesList.indexOf(updatee.get());
        if (indexOfUpdatee >= 0)
        {
            statesList.set(indexOfUpdatee, state);
            return 1;
        }
        return 0;

    }
}
