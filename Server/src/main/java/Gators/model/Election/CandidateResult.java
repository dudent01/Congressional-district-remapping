package Gators.model.Election;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CandidateResult
{
    private int id;
    private String name;
    private ElectionParty party;
    private int votes;

    public CandidateResult(@JsonProperty("id") int id,
                           @JsonProperty("name") String name,
                           @JsonProperty("party") ElectionParty party,
                           @JsonProperty("votes") int votes)
    {
        this.id = id;
        this.name = name;
        this.party = party;
        this.votes = votes;
    }

    public int getId()
    {
        return id;
    }

    public String getName()
    {
        return name;
    }

    public ElectionParty getParty()
    {
        return party;
    }

    public int getVotes()
    {
        return votes;
    }
}
