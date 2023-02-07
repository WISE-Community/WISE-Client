FROM node:18
RUN apt-get update && apt-get install build-essential \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
WORKDIR /app

CMD ["npm", "run", "serve-dev"]
