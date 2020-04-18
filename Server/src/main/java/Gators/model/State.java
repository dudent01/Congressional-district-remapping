package Gators.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Table(name = "State")
@PrimaryKeyJoinColumn(name = "ID")
public class State extends Territory
{
    @Column()
    private String abbr;

    public State() {}

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
}
