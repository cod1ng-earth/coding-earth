FROM node:10-alpine

ARG UID=1005
ARG GID=1005

RUN npm install -g yarn

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . ./

RUN addgroup -S --gid "$GID" appgroup \
    && adduser -S appuser -G appgroup \
    --uid "$UID" \
    --no-create-home \
    --disabled-password \
    --gecos "" \
    --home "$(pwd)"

RUN chown -R appuser:appgroup /app
USER $UID:$GID

CMD yarn run start