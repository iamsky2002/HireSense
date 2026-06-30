package com.sky.hiresense.ai;

import com.sky.hiresense.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final GeminiChatClient chat;
    private final ChatTools chatTools;

    public ChatService(GeminiChatClient chat, ChatTools chatTools) {
        this.chat = chat;
        this.chatTools = chatTools;
    }

    public String ask(User user, String message) {
        if (!chat.isEnabled()) {
            return "The AI assistant isn't available right now.";
        }
        try {
            return chat.reply(systemPrompt(user), message, chatTools.forUser(user));
        } catch (Exception e) {
            log.warn("chat failed for user {}", user.getId(), e);
            return "Sorry, I couldn't answer that right now.";
        }
    }

    // tells the model who it's talking to and that it can pull real data via tools
    private String systemPrompt(User user) {
        return "You are HireSense's assistant, helping a " + user.getRole()
                + " named " + user.getFullName() + " on a job platform. "
                + "Use the available tools to fetch their real data when relevant. "
                + "Be concise and friendly, and don't invent data.";
    }
}
