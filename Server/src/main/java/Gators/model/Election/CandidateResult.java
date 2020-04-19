package Gators.model.Election;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;

@Entity
public class CandidateResult
{
    @Id
    @GeneratedValue
    @Column
    private long id;

    @Column(name = "CRNAME")
    private String name;

    @Enumerated(EnumType.STRING)
    private ElectionParty party;

    @Column
    private int votes;

    @ManyToOne
    private Election election;

    public CandidateResult()
    {
    }

    public CandidateResult(@JsonProperty("id") int id,
                           @JsonProperty("name") String name,
                           @JsonProperty("party") ElectionParty party,
                           @JsonProperty("votes") int votes,
                           @JsonProperty("election") Election election)
    {
        this.id = id;
        this.name = name;
        this.party = party;
        this.votes = votes;
        this.election = election;
    }

    public long getId()
    {
        return id;
    }

    public void setId(long id)
    {
        this.id = id;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public ElectionParty getParty()
    {
        return party;
    }

    public void setParty(ElectionParty party)
    {
        this.party = party;
    }

    public int getVotes()
    {
        return votes;
    }

    public void setVotes(int votes)
    {
        this.votes = votes;
    }

    public Election getElection()
    {
        return election;
    }

    public void setElection(Election election)
    {
        this.election = election;
    }
}
