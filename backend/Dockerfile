# BEFORE:
# FROM node:18-slim

# AFTER: Use Node 20 or 22 slim, which includes updated system libraries
FROM node:22-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --only=production

# Bundle app source
COPY . .

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start the application
CMD [ "node", "server.js" ]