package Gators.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Set;

@Entity
@Getter
@Setter
public class State extends Territory {
    @Column
    private String abbr;

    @Column
    private String precinctsDataSource;

    @Column
    private String electionsDataSource;

    @JsonIgnore
    @OneToMany(mappedBy = "state")
    private Set<Precinct> precincts;
}
