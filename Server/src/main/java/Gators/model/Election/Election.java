package Gators.model.Election;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Election {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private long id;
//
//    @OneToOne(fetch = FetchType.LAZY)
//    private CandidateResult winner;

    @Enumerated(EnumType.STRING)
    private ElectionType type;

    @OneToMany(mappedBy = "election")
    private Set<CandidateResult> results;
}
