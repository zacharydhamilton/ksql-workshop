FROM node:12.4.0

RUN mkdir -p /generator
WORKDIR /generator
RUN mkdir /data

COPY ./package*.json ./
COPY ./data/* ./data/
COPY ./generator.js ./

RUN npm install .

ENTRYPOINT [ "npm", "start" ]