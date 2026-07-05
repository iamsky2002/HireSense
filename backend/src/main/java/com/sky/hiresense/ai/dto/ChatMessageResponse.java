package com.sky.hiresense.ai.dto;

import com.sky.hiresense.ai.Sender;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ChatMessageResponse {

    private Sender sender;
    private String content;
    private Instant createdAt;
}
