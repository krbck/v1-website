FROM nginxinc/nginx-unprivileged:alpine
# Patched Alpine packages even before the base tag is republished. The base image runs as
# uid 101 (USER $UID, ARG UID=101 in nginx/docker-nginx-unprivileged): root only for apk.
USER root
RUN apk upgrade --no-cache
USER 101
COPY . /usr/share/nginx/html/
