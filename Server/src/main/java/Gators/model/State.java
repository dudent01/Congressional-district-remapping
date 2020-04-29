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
    private String precinctsSource;

    @Column
    private String electionsSource;

    @JsonIgnore
    @OneToMany(mappedBy = "state")
    private Set<Precinct> precincts;
}
