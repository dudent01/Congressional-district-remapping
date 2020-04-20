package Gators.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

//  TODO rename all database variables in sql convention
@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
public abstract class Territory
{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column
    private long id;

    @Column(name = "geojson", columnDefinition = "MEDIUMTEXT")
    private String geojson;

    @Column
    private String name;
}
