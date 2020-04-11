package Gators.service;

import Gators.model.Territory;

import java.util.List;
import java.util.Optional;

public interface TerritoryService<T extends Territory>
{
    int add(T territory);

    List<T> getAll();

    Optional<T> getByAbbrName(String abbrName);

    int deleteByAbbrName(String abbrName);

    int updateByAbbrName(String abbrName, T territory);
}
