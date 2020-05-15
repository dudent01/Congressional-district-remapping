package Gators.model.Error;

import Gators.model.Precinct;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class AnomalousDataError extends Error {
//    @JsonIgnore
//    @ManyToOne(fetch = FetchType.LAZY)
    private long precinctId;

    @Enumerated(EnumType.STRING)
    private DataCategory dataCategory;

    @Column
    private String dataKey;
}
