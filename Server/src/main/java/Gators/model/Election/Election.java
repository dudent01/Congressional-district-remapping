package Gators.model.Election;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Entity
public class Election
{
    @Id
    @GeneratedValue
    @Column
    private long id;

    @OneToOne
    private CandidateResult winner;

    @Enumerated(EnumType.STRING)
    private ElectionType type;

    @OneToMany(mappedBy = "election")
    private Set<CandidateResult> results;

    public Election()
    {
    }

    public Election(@JsonProperty("winnerId") int winnerId,
                    @JsonProperty("type") ElectionType type,
                    @JsonProperty("results") CandidateResult[] results)
    {
        this.type = type;
        this.results = new HashSet<CandidateResult>(Arrays.asList(results));
        Optional<CandidateResult> winner = this.results.stream().filter(r -> r.getId() == winnerId).findFirst();
        this.winner = winner.isEmpty() ? null : winner.get();
    }

    public long getId()
    {
        return id;
    }

    public void setId(long id)
    {
        this.id = id;
    }

    public CandidateResult getWinner()
    {
        return winner;
    }

    public void setWinner(CandidateResult winner)
    {
        this.winner = winner;
    }

    public ElectionType getType()
    {
        return type;
    }

    public void setType(ElectionType type)
    {
        this.type = type;
    }

    public Set<CandidateResult> getResults()
    {
        return results;
    }

    public void setResults(Set<CandidateResult> results)
    {
        this.results = results;
    }
}
