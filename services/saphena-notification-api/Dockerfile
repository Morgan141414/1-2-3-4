FROM gradle:8.10.2-jdk21-alpine AS build

WORKDIR /app

COPY gradle gradle
COPY gradlew .
COPY build.gradle.kts .
COPY src src

RUN ./gradlew clean bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
