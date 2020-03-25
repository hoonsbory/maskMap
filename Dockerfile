FROM openjdk:8-jdk-alpine
VOLUME /var/log
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} maskmap-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-Djasypt.encryptor.password=","-jar","/maskmap-0.0.1-SNAPSHOT.jar"]

