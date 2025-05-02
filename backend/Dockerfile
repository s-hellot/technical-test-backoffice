FROM node:20

WORKDIR /app

RUN npm install -g typescript ts-node

COPY package*.json .

RUN npm install

COPY . /app

CMD ["npm", "start"]
