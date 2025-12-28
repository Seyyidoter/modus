package com.modus.backend.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
    LocalDateTime timestamp,
    int status,
    String error,
    String message,
    String path,
    String errorCode,
    Map<String, String> fieldErrors
) {}
