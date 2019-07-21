FROM node:10-alpine

RUN npm install -g yarn

WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . ./

CMD yarn run start