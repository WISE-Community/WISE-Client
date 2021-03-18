FROM node:10.24-alpine
RUN apk add chromium
ENV CHROME_BIN='/usr/bin/chromium-browser'

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "serve-dev"]
