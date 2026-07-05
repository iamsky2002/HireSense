package com.sky.hiresense.ai;

import com.sky.hiresense.ai.dto.ChatMessageResponse;
import com.sky.hiresense.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final GeminiChatClient chat;
    private final ChatTools chatTools;
    private final ChatMessageRepository messages;

    public ChatService(GeminiChatClient chat, ChatTools chatTools, ChatMessageRepository messages) {
        this.chat = chat;
        this.chatTools = chatTools;
        this.messages = messages;
    }

    public String ask(User user, String message) {
        if (!chat.isEnabled()) {
            return "The AI assistant isn't available right now.";
        }
        try {
            String reply = chat.reply(systemPrompt(user), message, chatTools.forUser(user));
            // only a real exchange is worth keeping; skip disabled/failed turns
            save(user, Sender.USER, message);
            save(user, Sender.ASSISTANT, reply);
            return reply;
        } catch (Exception e) {
            log.warn("chat failed for user {}", user.getId(), e);
            return "Sorry, I couldn't answer that right now.";
        }
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> history(User user) {
        return messages.findByUserIdOrderByCreatedAtAsc(user.getId()).stream()
                .map(m -> new ChatMessageResponse(m.getSender(), m.getContent(), m.getCreatedAt()))
                .toList();
    }

    private void save(User user, Sender sender, String content) {
        messages.save(ChatMessage.builder().user(user).sender(sender).content(content).build());
    }

    private String systemPrompt(User user) {
        return "You are HireSense's assistant, helping a " + user.getRole()
                + " named " + user.getFullName() + " on a job platform. "
                + "Use the available tools to fetch their real data when relevant. "
                + "Be concise and friendly, and don't invent data.";
    }
}
