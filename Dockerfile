# Stage 1: Build the Angular app
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire application code and build the app
COPY . .
RUN npm run build --prod

# Stage 2: Serve the app with NGINX
FROM nginx:alpine

# Copy built Angular app to NGINX's default public directory
COPY --from=build /usr/src/app/dist/angular-app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
