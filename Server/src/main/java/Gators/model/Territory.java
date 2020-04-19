package Gators.model;

import javax.persistence.*;
//  TODO rename all database variables in sql convention
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Territory
{
    @Id
    @GeneratedValue
    @Column
    private long id;

    @Column(name = "geojson")
    private String geojson;
    // name is keyword in MYSQL. Come up with something else
    @Column(name = "tName")
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
