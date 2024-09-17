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

# You can remove the Nginx-related instructions if not using Nginx in the container
