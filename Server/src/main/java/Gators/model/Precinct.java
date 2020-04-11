package Gators.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Precinct extends Territory
{
    private String stateAbbr;

    public Precinct(@JsonProperty("abbrName") String abbrName,
                    @JsonProperty("name") String name,
                    @JsonProperty("geoJson") String geoJson,
                    @JsonProperty("stateAbbr") String stateAbbr)
    {
        super(abbrName, name, geoJson);
        this.stateAbbr = stateAbbr;
    }

    public String getStateAbbr()
    {
        return stateAbbr;
    }
}
