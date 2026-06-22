package com.sky.hiresense.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

// talks to Qdrant (vector db) over REST
@Component
public class QdrantClient {

    private final RestClient rest;

    public QdrantClient(@Value("${app.qdrant.url:http://localhost:6333}") String url) {
        this.rest = RestClient.create(url);
    }

    public void ensureCollection(String name, int size) {
        try {
            rest.put().uri("/collections/{n}", name)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("vectors", Map.of("size", size, "distance", "Cosine")))
                    .retrieve().toBodilessEntity();
        } catch (Exception ignored) {
            // already exists or qdrant is down, skip
        }
    }

    public void upsert(String collection, long id, float[] vector) {
        rest.put().uri("/collections/{n}/points", collection)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("points", List.of(Map.of("id", id, "vector", toList(vector)))))
                .retrieve().toBodilessEntity();
    }

    public void delete(String collection, long id) {
        rest.post().uri("/collections/{n}/points/delete", collection)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("points", List.of(id)))
                .retrieve().toBodilessEntity();
    }

    @SuppressWarnings("unchecked")
    public List<Long> search(String collection, float[] vector, int limit) {
        Map<String, Object> resp = rest.post().uri("/collections/{n}/points/search", collection)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("vector", toList(vector), "limit", limit))
                .retrieve().body(Map.class);

        // take just the ids from the search result
        List<Map<String, Object>> result = (List<Map<String, Object>>) resp.get("result");
        return result.stream().map(r -> ((Number) r.get("id")).longValue()).toList();
    }

    private List<Float> toList(float[] v) {
        List<Float> list = new ArrayList<>(v.length);
        for (float f : v) list.add(f);
        return list;
    }
}
