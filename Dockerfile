FROM alpine:latest

WORKDIR /app

RUN \
    apk add --no-cache nodejs && \
    npm install -g vue-cli

ENV HOST 0.0.0.0
EXPOSE 3000
