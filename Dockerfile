FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

COPY package.json package-lock.json* ./
RUN npm install

EXPOSE 8080

CMD ["npm", "run", "serve"]
