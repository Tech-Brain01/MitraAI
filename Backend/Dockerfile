# Use an official Node.js runtime
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY Backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code
COPY Backend/ .

# Expose port 8080
EXPOSE 8080

# The command to run your backend server
CMD [ "node", "server.js" ]