FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

# Using host network binding for docker-compose dev mode
CMD ["npm", "run", "dev", "--", "--host"]