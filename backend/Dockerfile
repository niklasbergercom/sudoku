# syntax=docker/dockerfile:1

# Dependencies stage
FROM maven:3.9.9-eclipse-temurin-17 AS deps
WORKDIR /build

COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests dependency:go-offline

# Package stage
FROM deps AS package
COPY ./src src/
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests package \
 && mv target/*.jar target/app.jar

# Extract stage
FROM package AS extract
WORKDIR /build
RUN java -Djarmode=layertools -jar target/app.jar extract --destination target/extracted

# Runtime stage
FROM eclipse-temurin:17-jre-jammy AS final
ARG UID=10001
RUN adduser --disabled-password --gecos "" --home "/nonexistent" --shell "/sbin/nologin" --no-create-home --uid "${UID}" appuser
USER appuser

COPY --from=extract /build/target/extracted/dependencies/ ./
COPY --from=extract /build/target/extracted/spring-boot-loader/ ./
COPY --from=extract /build/target/extracted/snapshot-dependencies/ ./
COPY --from=extract /build/target/extracted/application/ ./

EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]