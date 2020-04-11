package Gators.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotBlank;

public abstract class Territory
{
    @NotBlank
    private final String abbrName;
    @NotBlank
    private final String name;
    @NotBlank
    private final String geoJson;


    public Territory(@JsonProperty("abbrName") String abbrName,
                     @JsonProperty("name") String name,
                     @JsonProperty("geoJson") String geoJson)
    {
        this.abbrName = abbrName;
        this.name = name;
        this.geoJson = geoJson;
    }

    public String getAbbrName()
    {
        return abbrName;
    }

    public String getName()
    {
        return name;
    }

    public String getGeoJson()
    {
        return geoJson;
    }
}
