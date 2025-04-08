FROM node:20-alpine3.16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ ./
EXPOSE 8082
CMD ["npm", "start"]
