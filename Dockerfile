# Use Node official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose port (Render ignores this but good practice)
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
