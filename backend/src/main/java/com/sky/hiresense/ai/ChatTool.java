package com.sky.hiresense.ai;

import java.util.Map;
import java.util.function.Supplier;

// one tool the assistant can call; run() fetches the data (no args for now)
public record ChatTool(String name, String description, Map<String, Object> parameters, Supplier<String> run) {

    static ChatTool noArg(String name, String description, Supplier<String> run) {
        return new ChatTool(name, description, Map.of("type", "object", "properties", Map.of()), run);
    }
}
