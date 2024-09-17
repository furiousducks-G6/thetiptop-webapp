# Use the official Node.js image as the base image
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build --prod

# Use a lightweight web server to serve the app
FROM nginx:alpine

# Copy the built Angular app from the previous stage
COPY --from=build /app/dist/thetiptop-web /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 9090 for the web server
EXPOSE 9090

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
