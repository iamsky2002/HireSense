package com.sky.hiresense.ai;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Supplier;

public record ChatTool(String name, String description, Map<String, Object> parameters,
                       Function<Map<String, Object>, String> run) {

    static ChatTool noArg(String name, String description, Supplier<String> run) {
        return new ChatTool(name, description, Map.of("type", "object", "properties", Map.of()),
                args -> run.get());
    }

    static ChatTool withQuery(String name, String description, Function<String, String> run) {
        Map<String, Object> params = Map.of(
                "type", "object",
                "properties", Map.of("query", Map.of("type", "string", "description", "what to search for")),
                "required", List.of("query"));
        return new ChatTool(name, description, params,
                args -> run.apply(String.valueOf(args.getOrDefault("query", ""))));
    }
}
