FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./ ./

EXPOSE 10103

CMD ["node", "server.js"]