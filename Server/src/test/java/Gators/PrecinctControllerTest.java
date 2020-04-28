package Gators;

import Gators.model.Demographic.Demographic;
import Gators.model.Precinct;
import Gators.model.State;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PrecinctControllerTest {
    private final TestRestTemplate testRestTemplate;

    @Autowired
    public PrecinctControllerTest(TestRestTemplate testRestTemplate) {
        this.testRestTemplate = testRestTemplate;
    }

    @Test
    public void testDemographicById() {
        // TODO finish this
//        ResponseEntity<Demographic> response = testRestTemplate.getForEntity("/api/precinct/1/demographic", Demographic.class);
//        assertEquals(2, response.getBody().getId());
//        assertEquals("UT", response.getBody().getWhitePop());
//        assertEquals("UT", response.getBody().getBlackPop());
//        assertEquals("Utah", response.getBody().getAsianPop());
//        assertEquals("UT", response.getBody().getBlackPop());
    }
}