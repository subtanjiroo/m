FROM node:18-alpine

WORKDIR /app

# Cài thêm dependency cần thiết cho build
RUN apk add --no-cache libc6-compat

# Copy file package.json và lockfile để cài dependencies
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development
ENV HOSTNAME="0.0.0.0"

# Chạy chế độ dev của Next.js
CMD ["npm", "run", "dev"]
