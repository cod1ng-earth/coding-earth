FROM node:10-alpine

ARG UID=1005
ARG GID=1005

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

RUN apk update && apk add python make g++

RUN egrep -i ":$GID:" /etc/passwd &>/dev/null || addgroup -S --gid "$GID" appgroup
RUN egrep -i ":$UID:" /etc/passwd &>/dev/null || adduser -S appuser -G appgroup \
    --uid "$UID" \
    --disabled-password

RUN chown -R $UID:$GID /app
USER $UID:$GID

CMD npm install && npm run start