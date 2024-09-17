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

# Step 2: Use a lightweight image to copy the built app
FROM alpine:latest

WORKDIR /usr/src/app

# Copy the built Angular app from the build stage
COPY --from=build /usr/src/app/dist/thetiptop-web /usr/src/app/dist/thetiptop-web

# Expose port (optional)
EXPOSE 8080

# Command to serve the app using a simple HTTP server (if needed)
# RUN apk add --no-cache python3 py3-pip && pip3 install httpserver
# CMD ["python3", "-m", "http.server", "8080"]
