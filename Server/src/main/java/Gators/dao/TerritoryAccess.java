package Gators.dao;

import Gators.model.Territory;

import java.util.List;
import java.util.Optional;

public interface TerritoryAccess<T extends Territory>
{
    int add(T newTerritory);

    List<T> getAll();

    Optional<T> getByAbbrName(String abbrName);

    int deleteByAbbrName(String abbrName);

    int updateByAbbrName(String abbrName, T state);
}
