FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

COPY package.json package-lock.json* ./
# Forge ile birebir aynı davranış: lockfile'daki versiyonları kullan.
# vue-apexcharts@1.x ↔ apexcharts@^3 peer çakışması için --legacy-peer-deps şart.
RUN npm ci --legacy-peer-deps

EXPOSE 8080

CMD ["npm", "run", "serve"]
