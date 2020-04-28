package Gators;

import Gators.model.State;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("")
class StateControllerTest {
    private final TestRestTemplate testRestTemplate;

    @Autowired
    public StateControllerTest(TestRestTemplate testRestTemplate) {
        this.testRestTemplate = testRestTemplate;
    }

    @Test
    public void testGetStateById() {
        ResponseEntity<State> response = testRestTemplate.getForEntity("/api/state/2", State.class);
        assertEquals(2, response.getBody().getId());
        assertEquals("Utah", response.getBody().getName());
        assertEquals("UT", response.getBody().getAbbr());
    }

    @Test
    public void testGetStateByAbbr() {
        ResponseEntity<State> response = testRestTemplate.getForEntity("/api/state/abbr/ut", State.class);
        assertEquals(2, response.getBody().getId());
        assertEquals("Utah", response.getBody().getName());
        assertEquals("UT", response.getBody().getAbbr());
    }
}