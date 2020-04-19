package Gators.model;

import Gators.model.Demographic.Demographic;
import Gators.model.Election.Election;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Precinct extends Territory
{
    @Column
    private String cName;

    @ManyToMany
    private Set<Precinct> neighbors;

    @OneToOne
    private Election pres2016;

    @OneToOne
    private Election cong2016;

    @OneToOne
    private Election cong2018;

    @OneToOne
    private Demographic demographic;

    @ManyToOne
    private State state;

    public Precinct()
    {
    }

    public Precinct(@JsonProperty("geojson") String geojson,
                    @JsonProperty("name") String name,
                    @JsonProperty("cName") String cName,
                    @JsonProperty("neighborIds") Set<Precinct> neighbors,
                    @JsonProperty("stateId") long stateId)
    {
        super(geojson, name);
        this.cName = cName;
        this.neighbors = neighbors;
//         this.state = stateRepository.findStateById(stateId);
    }

    public String getcName()
    {
        return cName;
    }

    public void setcName(String cName)
    {
        this.cName = cName;
    }

    public Set<Precinct> getNeighbors()
    {
        return neighbors;
    }

    public void setNeighbors(Set<Precinct> neighbors)
    {
        this.neighbors = neighbors;
    }

    public Election getPres2016()
    {
        return pres2016;
    }

    public void setPres2016(Election pres2016)
    {
        this.pres2016 = pres2016;
    }

    public Election getCong2016()
    {
        return cong2016;
    }

    public void setCong2016(Election cong2016)
    {
        this.cong2016 = cong2016;
    }

    public Election getCong2018()
    {
        return cong2018;
    }

    public void setCong2018(Election cong2018)
    {
        this.cong2018 = cong2018;
    }

    public Demographic getDemographic()
    {
        return demographic;
    }

    public void setDemographic(Demographic demographic)
    {
        this.demographic = demographic;
    }

    public State getState()
    {
        return state;
    }

    public void setState(State state)
    {
        this.state = state;
    }
}
