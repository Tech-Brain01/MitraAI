# Use a newer version of the Node.js runtime for the build stage
FROM node:20-alpine as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY Frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend code
COPY Frontend/ .

# Build the Vite application
RUN npm run build

# Use a lightweight Nginx image to serve the built files
FROM nginx:stable-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]