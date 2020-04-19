package Gators.model.Demographic;

import javax.persistence.*;

@Entity
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

    public Demographic()
    {
    }

    public long getId()
    {
        return id;
    }

    public void setId(long id)
    {
        this.id = id;
    }

    public int getPopulation()
    {
        return population;
    }

    public void setPopulation(int population)
    {
        this.population = population;
    }

    public Race getRace()
    {
        return race;
    }

    public void setRace(Race race)
    {
        this.race = race;
    }
}
