package com.modus.backend.config;

import com.modus.backend.domain.entity.User;
import com.modus.backend.domain.enums.Role;
import com.modus.backend.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@modus.app")) {
            User admin = User.builder()
                    .firstName("System")
                    .lastName("Admin")
                    .email("admin@modus.app")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created: admin@modus.app / admin123");
        }
    }
}
