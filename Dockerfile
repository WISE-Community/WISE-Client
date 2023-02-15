FROM node:18
RUN apt-get update && apt-get install build-essential \
    chromium libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
ENV CHROME_BIN='/usr/bin/chromium'
WORKDIR /app

CMD ["npm", "run", "serve-dev"]
