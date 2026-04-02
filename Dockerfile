# 1. Base image
FROM node:18

# 2. Create app directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Expose backend port
EXPOSE 5000

# 7. Run the app
CMD ["sh", "-c", "sleep 15 && npx prisma db push && npm start"]