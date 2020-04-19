package Gators.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

//  TODO rename all database variables in sql convention
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Getter
@Setter
@NoArgsConstructor
public abstract class Territory
{
    @Id
    @GeneratedValue
    @Column
    private long id;

    @Column(name = "geojson", columnDefinition = "MEDIUMTEXT")
    private String geojson;

    @Column
    private String name;

    public Territory(String geojson, String name)
    {
        this.geojson = geojson;
        this.name = name;
    }
}
