# Use Node.js LTS as the base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the server code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]