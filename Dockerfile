FROM node:10.16.0

WORKDIR /app

COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@10.1.2

COPY . /app

CMD ng serve --host 0.0.0.0
