package Gators.model.Election;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter @NoArgsConstructor
public class CandidateResult
{
    @Id
    @GeneratedValue
    @Column
    private long id;

    @Column
    private String name;

    @Enumerated(EnumType.STRING)
    private ElectionParty party;

    @Column
    private int votes;

    @ManyToOne
    private Election election;

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
}
