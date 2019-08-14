FROM node:10-alpine

ARG UID=1005
ARG GID=1005

RUN npm install -g yarn

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

RUN egrep -i ":$GID:" /etc/passwd &>/dev/null || addgroup -S --gid "$GID" appgroup
RUN egrep -i ":$UID:" /etc/passwd &>/dev/null || adduser -S appuser -G appgroup \
    --uid "$UID" \
    --disabled-password

RUN chown -R $UID:$GID /app
USER $UID:$GID

CMD yarn install && yarn start