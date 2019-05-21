FROM node:10-alpine

RUN npm install -g yarn

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./

CMD [ "yarn", "run", "start" ]