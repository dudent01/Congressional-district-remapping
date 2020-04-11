package Gators.service;

import Gators.dao.PrecinctAccess;
import Gators.model.Precinct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrecinctService implements TerritoryService<Precinct>
{
    private final PrecinctAccess precinctAccess;

    @Autowired
    public PrecinctService(@Qualifier("FakePrecinctAccess") PrecinctAccess precinctAccess)
    {
        this.precinctAccess = precinctAccess;
    }

    public int add(Precinct precinct)
    {
        return precinctAccess.add(precinct);
    }

    public List<Precinct> getAll()
    {
        return precinctAccess.getAll();
    }

    public Optional<Precinct> getByAbbrName(String abbrName)
    {
        return precinctAccess.getByAbbrName(abbrName);
    }

    public int deleteByAbbrName(String abbrName)
    {
        return precinctAccess.deleteByAbbrName(abbrName);
    }

    public int updateByAbbrName(String abbrName, Precinct precinct)
    {
        return precinctAccess.updateByAbbrName(abbrName, precinct);
    }
}
