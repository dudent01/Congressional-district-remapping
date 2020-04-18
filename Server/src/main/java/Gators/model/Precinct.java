package Gators.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "PRECINCT")
@PrimaryKeyJoinColumn(name = "ID")
public class Precinct extends Territory
{
    @Column
    private String cName;

    @ElementCollection
    private List<Long> neighborIds;

    @ManyToOne
    private State state;

    public Precinct() {}

    public Precinct(@JsonProperty("geojson") String geojson,
                    @JsonProperty("name") String name,
                    @JsonProperty("cName") String cName,
                    @JsonProperty("neighborIds") List<Long> neighborIds,
                    @JsonProperty("stateId") long stateId)
    {
        super(geojson, name);
        this.cName = cName;
        this.neighborIds = neighborIds;
//         this.state = stateRepository.findStateById(stateId);
    }

    public String getCName()
    {
        return cName;
    }

    public void setCName(String cName)
    {
        this.cName = cName;
    }

    public List<Long> getNeighborIds()
    {
        return neighborIds;
    }

    public void setNeighborIds(List<Long> neighborIds)
    {
        this.neighborIds = neighborIds;
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
