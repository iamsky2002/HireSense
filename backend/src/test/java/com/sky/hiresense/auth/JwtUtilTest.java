package com.sky.hiresense.auth;

import com.sky.hiresense.user.Role;
import com.sky.hiresense.user.User;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    // secret must be at least 32 chars for HS256
    private final JwtUtil jwtUtil =
            new JwtUtil("test-secret-key-that-is-long-enough-1234567890", 86400000L);

    private User sampleUser() {
        return User.builder()
                .id(1L)
                .email("test@hiresense.com")
                .role(Role.CANDIDATE)
                .build();
    }

    @Test
    void generatedToken_isValid_andHasCorrectEmail() {
        String token = jwtUtil.generateToken(sampleUser());

        assertThat(jwtUtil.isValid(token)).isTrue();
        assertThat(jwtUtil.extractEmail(token)).isEqualTo("test@hiresense.com");
    }

    @Test
    void garbageToken_isNotValid() {
        assertThat(jwtUtil.isValid("not-a-real-token")).isFalse();
    }
}
