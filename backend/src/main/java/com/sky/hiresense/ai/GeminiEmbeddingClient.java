package com.sky.hiresense.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

// calls Gemini to turn a text into an embedding vector
@Component
public class GeminiEmbeddingClient {

    private final String apiKey;
    private final String model;
    private final RestClient rest = RestClient.create();

    public GeminiEmbeddingClient(@Value("${app.gemini.api-key:}") String apiKey,
                                 @Value("${app.gemini.embedding-model:gemini-embedding-001}") String model) {
        this.apiKey = apiKey;
        this.model = model;
    }

    public boolean isEnabled() {
        return apiKey != null && !apiKey.isBlank();
    }

    @SuppressWarnings("unchecked")
    public float[] embed(String text) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + model + ":embedContent?key=" + apiKey;
        Map<String, Object> body = Map.of(
                "model", "models/" + model,
                "content", Map.of("parts", List.of(Map.of("text", text))),
                "outputDimensionality", 768  // keep it 768 so it fits the qdrant collection
        );

        Map<String, Object> resp = rest.post().uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);

        // response has embedding.values, copy them into a float array
        Map<String, Object> embedding = (Map<String, Object>) resp.get("embedding");
        List<Number> values = (List<Number>) embedding.get("values");
        float[] vec = new float[values.size()];
        for (int i = 0; i < values.size(); i++) {
            vec[i] = values.get(i).floatValue();
        }
        return vec;
    }
}
