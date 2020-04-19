package Gators.model.Error;

import Gators.model.Precinct;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity
public class MapCoverageError extends Error
{
    @Column
    private String geojson;

    @ManyToMany
    private Set<Precinct> neighbors;

    public String getGeojson()
    {
        return geojson;
    }

    public void setGeojson(String geojson)
    {
        this.geojson = geojson;
    }

    public Set<Precinct> getNeighbors()
    {
        return neighbors;
    }

    public void setNeighbors(Set<Precinct> neighbors)
    {
        this.neighbors = neighbors;
    }
}
