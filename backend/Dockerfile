# Stage 1: Build
FROM gradle:8.5.0-jdk21-alpine AS builder
WORKDIR /app
COPY . .
RUN ./gradlew clean bootJar --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy JAR
COPY --from=builder /app/build/libs/*.jar app.jar

# Configuration
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
