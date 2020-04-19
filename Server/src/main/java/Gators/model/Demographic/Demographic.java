package Gators.model.Demographic;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Demographic
{
    @Id
    @GeneratedValue
    @Column
    private long id;

    @Column
    private int population;

    @Enumerated(EnumType.STRING)
    private Race race;
}
