package Gators.repository;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
public class Repositories {
    private PrecinctRepository precinctRepository;

    private StateRepository stateRepository;

    @Autowired
    public Repositories(PrecinctRepository precinctRepository, StateRepository stateRepository) {
        this.precinctRepository = precinctRepository;
        this.stateRepository = stateRepository;
    }
}
