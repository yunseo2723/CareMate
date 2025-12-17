# ---- Build stage ----
FROM gradle:8.9-jdk17 as build
WORKDIR /workspace
COPY backend/ ./
RUN ./gradlew clean bootJar --no-daemon

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
# 빌드 산출물 경로에 맞게 *.jar 복사
COPY --from=build /workspace/build/libs/*.jar /app/app.jar

# Render는 PORT 환경변수를 지정함 → SpringBoot가 그 포트로 뜨게
ENV JAVA_OPTS="-Xms256m -Xmx512m"
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:${PORT:-8080}/actuator/health || exit 1
ENTRYPOINT ["sh","-c","java -Dserver.port=${PORT:-8080} $JAVA_OPTS -jar /app/app.jar"]
