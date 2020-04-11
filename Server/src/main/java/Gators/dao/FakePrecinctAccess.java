package Gators.dao;

import Gators.model.Precinct;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository("FakePrecinctAccess")
public class FakePrecinctAccess implements PrecinctAccess
{
    private static List<Precinct> precinctsList = new ArrayList<>();

    @Override
    public int add(Precinct newPrecinct)
    {
        if (precinctsList.stream().anyMatch(precinct -> precinct.getAbbrName().equals(newPrecinct.getAbbrName())))
            return 0;
        precinctsList.add(newPrecinct);
        return 1;
    }

    @Override
    public List<Precinct> getAll()
    {
        return precinctsList;
    }

    @Override
    public Optional<Precinct> getByAbbrName(String abbrName)
    {
        return precinctsList.stream().filter(Precinct -> Precinct.getAbbrName().equals(abbrName)).findFirst();
    }

    @Override
    public int deleteByAbbrName(String abbrName)
    {
        Optional<Precinct> precinct = getByAbbrName(abbrName);
        if (precinct.isEmpty())
            return 0;
        precinctsList.remove(precinct.get());
        return 1;
    }

    @Override
    public int updateByAbbrName(String abbrName, Precinct precinct)
    {
        Optional<Precinct> updatee = getByAbbrName(abbrName);
        if (updatee.isEmpty())
            return 0;

        int indexOfUpdatee = precinctsList.indexOf(updatee.get());
        if (indexOfUpdatee >= 0)
        {
            precinctsList.set(indexOfUpdatee, precinct);
            return 1;
        }
        return 0;

    }
}
