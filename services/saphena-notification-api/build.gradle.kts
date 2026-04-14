plugins {
    kotlin("jvm") version "1.9.22"
    kotlin("plugin.spring") version "1.9.22"
    kotlin("plugin.jpa") version "1.9.25"
    id("org.springframework.boot") version "3.3.10"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "kz.saphena"
version = "0.1.0"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    // Kotlin support
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // MongoDB
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb")

    // Twilio for WhatsApp
    implementation("com.twilio.sdk:twilio:10.7.2")


    // Testing
    testImplementation("org.springframework.boot:spring-boot-starter-test")

}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}


tasks.withType<Test> {
    useJUnitPlatform()
}
