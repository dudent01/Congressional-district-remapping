package Gators.model;

import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
@Getter
@Setter
@MappedSuperclass
public abstract class Territory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private long id;

    @Column(name = "geojson", columnDefinition = "MEDIUMTEXT")
    private String geojson;

    @Column
    private String name;
}
