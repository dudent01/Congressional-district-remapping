package Gators.model;

import Gators.model.Demographic.Demographic;
import Gators.model.Election.Election;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Precinct extends Territory
{
    @Column
    private String cName;

//    @ManyToMany
//    @JsonIgnore
//    private Set<Precinct> neighbors;

    @OneToOne(fetch =  FetchType.LAZY)
    private Election pres2016;

    @OneToOne(fetch =  FetchType.LAZY)
    private Election cong2016;

    @OneToOne(fetch =  FetchType.LAZY)
    private Election cong2018;

    @OneToOne(fetch =  FetchType.LAZY)
    private Demographic demographic;

    @ManyToOne(fetch =  FetchType.LAZY)
    private State state;

    public Precinct(@JsonProperty("geojson") String geojson,
                    @JsonProperty("name") String name,
                    @JsonProperty("cName") String cName,
                    @JsonProperty("neighborIds") Set<Precinct> neighbors,
                    @JsonProperty("stateId") long stateId)
    {
        super(geojson, name);
        this.cName = cName;
//        this.neighbors = neighbors;
//      TODO   this.state = stateRepository.findStateById(stateId);
    }
}
