package Gators.model.Election;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class CandidateResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private long id;

    @Column
    private String name;

    @Enumerated(EnumType.STRING)
    private ElectionParty party;

    @Column
    private int votes;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Election election;
}
