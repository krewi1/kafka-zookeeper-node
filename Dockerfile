FROM node:13-alpine

WORKDIR /app
ADD . .
RUN npm install
CMD ["npm", "start"]