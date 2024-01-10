# Stage 1: build application
FROM node:latest as node
RUN apt-get update && apt-get install build-essential \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build-prod

# Stage 2: Copy to Nginx
FROM nginx:latest
RUN mkdir /usr/share/nginx/html/wise-client
COPY --from=node /app/dist /usr/share/nginx/html/wise-client
