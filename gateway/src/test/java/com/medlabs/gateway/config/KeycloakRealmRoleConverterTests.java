package com.medlabs.gateway.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

class KeycloakRealmRoleConverterTests {

    private final KeycloakRealmRoleConverter converter = new KeycloakRealmRoleConverter();

    @Test
    void convertsKeycloakRealmRolesToSpringAuthorities() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60))
                .claim("realm_access", Map.of("roles", List.of("ADMIN", "LAB_TECHNICIAN")))
                .build();

        List<String> authorities = converter.convert(jwt).stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        assertThat(authorities).containsExactly("ROLE_ADMIN", "ROLE_LAB_TECHNICIAN");
    }

    @Test
    void returnsNoAuthoritiesWhenRealmRolesAreMissing() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60))
                .build();

        assertThat(converter.convert(jwt)).isEmpty();
    }
}
