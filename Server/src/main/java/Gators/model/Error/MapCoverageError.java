package Gators.model.Error;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MapCoverageError extends Error {
    @Column(name = "geojson", columnDefinition = "MEDIUMTEXT")
    private String geojson;

    @Column
    private String mapCoverageType;

    //    @ManyToMany
    //    private Set<Precinct> neighbors;
}