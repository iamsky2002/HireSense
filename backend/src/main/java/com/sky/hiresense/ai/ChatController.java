package com.sky.hiresense.ai;

import com.sky.hiresense.ai.dto.ChatMessageResponse;
import com.sky.hiresense.ai.dto.ChatRequest;
import com.sky.hiresense.ai.dto.ChatResponse;
import com.sky.hiresense.user.User;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// AI assistant chat (any logged-in user)
@RestController
@RequestMapping("/api/ai")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@Valid @RequestBody ChatRequest req, @AuthenticationPrincipal User user) {
        return new ChatResponse(chatService.ask(user, req.getMessage()));
    }

    @GetMapping("/chat/history")
    public List<ChatMessageResponse> history(@AuthenticationPrincipal User user) {
        return chatService.history(user);
    }
}
