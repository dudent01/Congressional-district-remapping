package Gators.model;

import javax.persistence.*;
//  TODO rename all database variables in sql convention
@MappedSuperclass
public abstract class Territory
{
    @Id
    @GeneratedValue
    @Column
    private long id;

    @Column(name = "geojson", columnDefinition = "TEXT")
    private String geojson;

    @Column
    private String name;

    public Territory() {}

    public Territory(String geojson, String name)
    {
        this.geojson = geojson;
        this.name = name;
    }

    public long getId()
    {
        return id;
    }

    public void setId(long id)
    {
        this.id = id;
    }

    public String getGeojson()
    {
        return geojson;
    }

    public void setGeojson(String geojson)
    {
        this.geojson = geojson;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }
}
