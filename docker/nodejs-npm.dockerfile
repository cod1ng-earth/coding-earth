FROM node:10-alpine

ARG UID=1005
ARG GID=1005

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

RUN apk update && apk add python make g++

COPY package*.json ./
RUN npm install
COPY . ./

RUN addgroup -S --gid "$GID" appgroup \
    && adduser -S appuser -G appgroup \
    --uid "$UID" \
    --disabled-password

RUN chown -R appuser:appgroup /app
USER $UID:$GID

CMD npm run start