FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y vim

COPY ./ ./

EXPOSE 10103

CMD ["npm", "start"]