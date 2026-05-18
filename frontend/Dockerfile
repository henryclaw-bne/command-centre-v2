FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

ENV NEXT_TELEMETRY_DISABLED=1

CMD ["sh", "-c", "node_modules/.bin/next start -H 0.0.0.0 -p ${PORT:-3000}"]
