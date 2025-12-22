# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the source code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
