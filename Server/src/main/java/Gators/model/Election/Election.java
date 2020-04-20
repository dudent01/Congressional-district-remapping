package Gators.model.Election;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Election
{
    @Id
    @GeneratedValue
    @Column
    private long id;

    @OneToOne(fetch =  FetchType.LAZY)
    private CandidateResult winner;

    @Enumerated(EnumType.STRING)
    private ElectionType type;

    @OneToMany(mappedBy = "election")
    private Set<CandidateResult> results;
}
