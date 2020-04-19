package Gators.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Repositories
{
    public static PrecinctRepository precinctRepository;

    public static StateRepository stateRepository;

    @Autowired
    public Repositories(PrecinctRepository precinctRepository, StateRepository stateRepository)
    {
        Repositories.precinctRepository = precinctRepository;
        Repositories.stateRepository = stateRepository;
    }
}
