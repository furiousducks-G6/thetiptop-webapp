FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . . 

CMD ["ng", "serve", "--host", "0.0.0.0"]
