# ================================
# 🔨 STAGE 1: Build with Gradle
# ================================
FROM gradle:8.10.2-jdk21-alpine AS build

RUN mkdir -p /app/logs

# Подготовим рабочую директорию
WORKDIR /app

# Прогреваем wrapper — он скачает gradle только один раз
COPY gradle gradle
COPY gradlew .
RUN ./gradlew --version || true

# Копируем только файлы конфигурации сначала (для кеша)
COPY settings.gradle.kts .
COPY build.gradle.kts .
COPY gradle.properties .   

# Скачаем зависимости (кешируется отдельно от кода)
RUN --mount=type=cache,target=/home/gradle/.gradle ./gradlew dependencies --no-daemon

# Теперь копируем исходники
COPY src src

# Собираем проект, пропуская тесты и ведя лог в файл
RUN ./gradlew clean build -x test --no-daemon --parallel > /app/build.log 2>&1

# ================================
# 🚀 STAGE 2: Run lightweight image
# ================================
FROM eclipse-temurin:21-jre-alpine

# Директория для приложения
WORKDIR /app

# Копируем собранный JAR
COPY --from=build /app/build/libs/*.jar app.jar

# Опционально копируем ресурсы (если не внутри JAR)
COPY --from=build /app/src/main/resources/static /app/resources/static
COPY --from=build /app/src/main/resources/templates /app/resources/templates

# Логирование в stdout + файл
ENTRYPOINT ["java", "-Xms1g", "-Xmx2g", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar", ">>", "/app/logs/app.log", "2>&1"]
