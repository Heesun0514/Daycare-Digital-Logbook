# BEFORE:
# FROM node:18-slim

# AFTER: Use Node 20 or 22 slim, which includes updated system libraries
FROM node:22-slim


# Install the minimal tools required to compile native C++ binaries
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# CRUCIAL: Force npm to compile sqlite3 directly from source code
RUN npm install --only=production --build-from-source=sqlite3

# Bundle app source
COPY . .

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start the application
CMD [ "node", "server.js" ]