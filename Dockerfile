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

# Step 2: Serve the built app with Nginx
FROM nginx:alpine

# Copy the built Angular files from the build stage to Nginx's directory
COPY --from=build /usr/src/app/dist/thetiptop-web /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
