package Gators.api;

import Gators.model.Error.ErrorType;
import Gators.model.Error.SparseError;
import Gators.service.ErrorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Set;

@RequestMapping("api/error")
@RestController
public class ErrorController {
    private final ErrorService errorService;

    @Autowired
    public ErrorController(ErrorService errorService) {
        this.errorService = errorService;
    }

    @GetMapping(path = "/state/{stateAbbr}")
    public HashMap<String, Set<? extends SparseError>> getErrorsByStateAbbr(@PathVariable String stateAbbr) {
        return errorService.getErrorsByStateAbbr(stateAbbr);
    }

    @PatchMapping(path = "/{id}/fix")
    public boolean setFixed(@PathVariable long id, @RequestBody ErrorType errorType) {
        errorService.setFixed(id, errorType);
        return true;
    }
}
