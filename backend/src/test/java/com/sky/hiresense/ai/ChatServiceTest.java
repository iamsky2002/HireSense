package com.sky.hiresense.ai;

import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock private GeminiChatClient chat;
    @Mock private ChatTools chatTools;

    @InjectMocks private ChatService chatService;

    private User user() {
        return User.builder().id(1L).fullName("Ravi").role(Role.CANDIDATE).build();
    }

    @Test
    void ask_whenAiDisabled_returnsFallbackMessage() {
        when(chat.isEnabled()).thenReturn(false);

        assertThat(chatService.ask(user(), "hi")).contains("isn't available");
    }

    @Test
    void ask_whenEnabled_returnsModelReply() {
        when(chat.isEnabled()).thenReturn(true);
        when(chatTools.forUser(any())).thenReturn(List.of());
        when(chat.reply(anyString(), eq("hi"), anyList())).thenReturn("Hello Ravi!");

        assertThat(chatService.ask(user(), "hi")).isEqualTo("Hello Ravi!");
    }
}
