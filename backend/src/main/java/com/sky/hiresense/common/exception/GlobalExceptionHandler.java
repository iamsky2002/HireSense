package com.sky.hiresense.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

// Turns all exceptions into one consistent JSON shape.
// aur errors ko Spring ke internal /error forward se bachata hai, jo
// Spring Security ke saath galti se 403 ban jata tha.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // handles errors thrown from the service layer (404, 403, 409, etc.)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException ex, HttpServletRequest req) {
        return ResponseEntity.status(ex.getStatusCode())
                .body(body(ex.getStatusCode().value(),
                        ex.getReason() != null ? ex.getReason() : "Request failed",
                        req));
    }

    // @Valid failures (400), tells which field was wrong
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fields = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> fields.put(e.getField(), e.getDefaultMessage()));

        Map<String, Object> body = body(400, "Validation failed", req);
        body.put("fields", fields);
        return ResponseEntity.badRequest().body(body);
    }

    // builds the common error response body
    private Map<String, Object> body(int status, String message, HttpServletRequest req) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("timestamp", Instant.now().toString());
        map.put("status", status);
        map.put("message", message);
        map.put("path", req.getRequestURI());
        return map;
    }
}
