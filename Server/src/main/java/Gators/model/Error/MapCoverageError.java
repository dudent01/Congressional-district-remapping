package Gators.model.Error;

import Gators.model.Precinct;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity
@Getter
@Setter
public class MapCoverageError extends Error
{
    @Column
    private String geojson;

    @ManyToMany
    private Set<Precinct> neighbors;
}
