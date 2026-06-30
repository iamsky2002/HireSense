package com.sky.hiresense.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GeminiChatClient {

    private final String apiKey;
    private final String model;
    private final RestClient rest = RestClient.create();

    public GeminiChatClient(@Value("${app.gemini.api-key:}") String apiKey,
                            @Value("${app.gemini.chat-model:gemini-flash-latest}") String model) {
        this.apiKey = apiKey;
        this.model = model;
    }

    public boolean isEnabled() {
        return apiKey != null && !apiKey.isBlank();
    }

    @SuppressWarnings("unchecked")
    public String reply(String systemInstruction, String userMessage, List<ChatTool> tools) {
        List<Map<String, Object>> contents = new ArrayList<>();
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", userMessage))));
        Object toolDeclarations = toolDeclarations(tools);

        // a few rounds: the model may ask for a tool, we run it and feed the result back, then it answers
        for (int round = 0; round < 5; round++) {
            Map<String, Object> body = new HashMap<>();
            body.put("system_instruction", Map.of("parts", List.of(Map.of("text", systemInstruction))));
            body.put("contents", contents);
            if (toolDeclarations != null) body.put("tools", toolDeclarations);

            Map<String, Object> resp = rest.post()
                    .uri("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            Map<String, Object> content = (Map<String, Object>)
                    ((Map<String, Object>) ((List<?>) resp.get("candidates")).get(0)).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

            List<Map<String, Object>> calls = parts.stream().filter(p -> p.containsKey("functionCall")).toList();
            if (calls.isEmpty()) {
                return parts.stream()
                        .filter(p -> p.containsKey("text"))
                        .map(p -> (String) p.get("text"))
                        .reduce("", String::concat);
            }

            contents.add(content);
            List<Map<String, Object>> responseParts = new ArrayList<>();
            for (Map<String, Object> p : calls) {
                Map<String, Object> fc = (Map<String, Object>) p.get("functionCall");
                String name = (String) fc.get("name");
                Map<String, Object> args = (Map<String, Object>) fc.getOrDefault("args", Map.of());
                responseParts.add(Map.of("functionResponse",
                        Map.of("name", name, "response", Map.of("result", run(tools, name, args)))));
            }
            contents.add(Map.of("role", "user", "parts", responseParts));
        }
        return "Sorry, I couldn't finish that.";
    }

    private Object toolDeclarations(List<ChatTool> tools) {
        if (tools.isEmpty()) return null;
        List<Map<String, Object>> decls = tools.stream()
                .map(t -> Map.of("name", t.name(), "description", t.description(), "parameters", t.parameters()))
                .toList();
        return List.of(Map.of("function_declarations", decls));
    }

    private String run(List<ChatTool> tools, String name, Map<String, Object> args) {
        return tools.stream()
                .filter(t -> t.name().equals(name)).findFirst()
                .map(t -> t.run().apply(args))
                .orElse("unknown tool");
    }
}
