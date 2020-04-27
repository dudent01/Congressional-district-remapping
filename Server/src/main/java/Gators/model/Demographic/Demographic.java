package Gators.model.Demographic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Demographic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private long id;

    @Column
    private int whitePop;

    @Column
    private int blackPop;

    @Column
    private int asianPop;

    @Column
    private int hispanicPop;

    @Column
    private int otherPop;
}
