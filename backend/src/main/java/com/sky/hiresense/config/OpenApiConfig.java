package com.sky.hiresense.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI hireSenseOpenApi() {
        // so Swagger UI's Authorize button can send the JWT
        SecurityScheme jwtScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT");

        return new OpenAPI()
                .info(new Info()
                        .title("HireSense API")
                        .version("v1")
                        .description("Recruitment platform API: auth, jobs, applications, profiles, AI matching."))
                .components(new Components().addSecuritySchemes("bearer-jwt", jwtScheme))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }
}
