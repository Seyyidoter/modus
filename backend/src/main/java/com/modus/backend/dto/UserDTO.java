package com.modus.backend.dto;

import com.modus.backend.domain.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private OffsetDateTime createdAt;
}
