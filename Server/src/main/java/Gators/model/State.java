package Gators.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.Set;

@Entity
public class State extends Territory
{
    @Column
    private String abbr;

    @OneToMany(mappedBy = "state")
    private Set<Precinct> precincts;

    public State()
    {
    }

    public State(@JsonProperty("geojson") String geojson,
                 @JsonProperty("name") String name,
                 @JsonProperty("abbr") String abbr)
    {
        super(geojson, name);
        this.abbr = abbr;
    }

    public String getAbbr()
    {
        return abbr;
    }

    public void setAbbr(String abbr)
    {
        this.abbr = abbr;
    }

    public Set<Precinct> getPrecincts()
    {
        return precincts;
    }

    public void setPrecincts(Set<Precinct> precincts)
    {
        this.precincts = precincts;
    }
}
