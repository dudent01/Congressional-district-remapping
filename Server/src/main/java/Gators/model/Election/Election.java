package Gators.model.Election;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

public class Election
{
    CandidateResult winner;
    ElectionType type;
    ArrayList<CandidateResult> results;

    public Election(@JsonProperty("winnerId") int winnerId,
                    @JsonProperty("type") ElectionType type,
                    @JsonProperty("results") CandidateResult[] results)
    {
        this.type = type;
        this.results = new ArrayList<>(Arrays.asList(results));
        Optional<CandidateResult> winner = this.results.stream().filter(r -> r.getId() == winnerId).findFirst();
        this.winner = winner.isEmpty() ? null : winner.get();
    }

    public CandidateResult getWinner()
    {
        return winner;
    }

    public ElectionType getType()
    {
        return type;
    }

    public ArrayList<CandidateResult> getResults()
    {
        return results;
    }
}
