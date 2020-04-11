package Gators.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class State extends Territory
{
    private final String[] precinctAbbrs;

    public State(@JsonProperty("abbrName") String abbrName,
                 @JsonProperty("name") String name,
                 @JsonProperty("geoJson") String geoJson,
                 @JsonProperty("precinctAbbrs") String[] precinctAbbrs)
    {
        super(abbrName, name, geoJson);
        this.precinctAbbrs = precinctAbbrs;
    }

    public String[] getPrecincts()
    {
        return precinctAbbrs;
    }
}
