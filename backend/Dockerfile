# syntax=docker/dockerfile:1

# =============================================================================
# MingleMart backend — Spring Boot 4.1 on Java 21.
#
# Two stages. The first has a JDK and Maven and builds the jar; the second has
# only a JRE and runs it. Nothing from the first stage ships, so the compiler,
# the dependency cache and the source tree never reach production.
#
# Build from this directory:
#   docker build -t minglemart-backend .
#
# It needs a database and a token secret at run time — see the run notes at the
# bottom of this file.
# =============================================================================

# ------------------------------------------------------------------ build ---
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /build

# Resolve dependencies from the pom alone, before the source is copied, so this
# layer survives every build that does not change the pom — editing a
# controller no longer re-downloads Spring.
#
# Best effort on purpose: `go-offline` is a cache-warming step, and it trips
# over plugins that resolve late. If it fails, `package` below simply fetches
# what is missing. A warm cache is an optimisation and must never fail a build.
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B dependency:go-offline || true

COPY src ./src

# Tests are skipped here deliberately. The integration suite drives
# Testcontainers, which needs a Docker daemon that an image build does not
# have. Run them in CI, on a runner that does.
RUN --mount=type=cache,target=/root/.m2 mvn -B clean package -DskipTests \
 && mv target/minglemart-*.jar app.jar

# Unpack the fat jar into its four layers. Dependencies change far less often
# than application code, so splitting them means a one-line code change pushes
# a few hundred KB rather than the whole jar.
RUN java -Djarmode=tools -jar app.jar extract --layers --launcher --destination extracted

# ---------------------------------------------------------------- runtime ---
FROM eclipse-temurin:21-jre-alpine AS runtime

# Unprivileged: nothing here needs root, and an application that cannot write
# to its own installation is one less thing to build an exploit on.
RUN addgroup -S minglemart && adduser -S -G minglemart minglemart

WORKDIR /app

# Ordered least-changing first, so a rebuild reuses every layer above the one
# that actually changed.
COPY --from=build --chown=minglemart:minglemart /build/extracted/dependencies/ ./
COPY --from=build --chown=minglemart:minglemart /build/extracted/spring-boot-loader/ ./
COPY --from=build --chown=minglemart:minglemart /build/extracted/snapshot-dependencies/ ./
COPY --from=build --chown=minglemart:minglemart /build/extracted/application/ ./

USER minglemart

# The Docker Compose starter exists for local development, where it boots
# compose.yaml and injects the datasource. Inside a container there is neither
# a compose file nor a daemon to talk to, so turn it off and pass the
# connection details in through the environment instead.
ENV SPRING_DOCKER_COMPOSE_ENABLED=false

# Read by the JVM itself rather than passed as arguments, which lets the
# entrypoint stay in exec form: java runs as PID 1, receives SIGTERM directly
# and shuts Spring down gracefully instead of being killed mid-request.
# Override the whole variable to tune the JVM at run time.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0"

EXPOSE 8080

# GET /actuator/health is permitAll in SecurityConfig, so this needs no
# credentials. The start period covers Flyway applying V1..V8 on first boot
# against an empty database.
HEALTHCHECK --interval=30s --timeout=3s --start-period=45s --retries=3 \
    CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"status":"UP"' || exit 1

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]

# -----------------------------------------------------------------------------
# Running it. The image carries no configuration of its own: the datasource and
# the token secret have no safe defaults, so they are required at run time.
#
#   docker run --rm -p 8080:8080 \
#     -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/minglemart \
#     -e SPRING_DATASOURCE_USERNAME=minglemart \
#     -e SPRING_DATASOURCE_PASSWORD=secret \
#     -e MINGLEMART_TOKEN_SECRET="$(openssl rand -base64 48)" \
#     minglemart-backend
#
# MINGLEMART_TOKEN_SECRET must be at least 32 bytes or the app refuses to
# start. The .env file is a development convenience and is deliberately kept
# out of the image by .dockerignore; real environment variables take precedence
# over it in any case.
# -----------------------------------------------------------------------------
