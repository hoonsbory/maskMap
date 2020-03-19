FROM openjdk:8-jdk-alpine
VOLUME /var/log
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} maskmap-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/maskmap-0.0.1-SNAPSHOT.jar"]

