FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./ ./

EXPOSE 10101

CMD ["node", "server.js"]