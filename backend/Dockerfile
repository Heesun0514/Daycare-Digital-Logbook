# Use the official Node.js image
FROM node:18-slim

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
CMD [ "node", "attendance.test.js" ]