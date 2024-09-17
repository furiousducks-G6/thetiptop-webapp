# Step 1: Build the Angular app
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Angular app in production mode
RUN npm run build -- --configuration production

# Step 2: Use a minimal image to run the Angular app (Optional)
# If you want to serve the Angular app using a simple HTTP server
# You can use an HTTP server like `http-server` to serve the static files.
# Here we use a multi-stage build to reduce the final image size.

FROM nginx:alpine

# Copy the built Angular app to the Nginx directory
COPY --from=build /usr/src/app/dist/thetiptop-web /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
