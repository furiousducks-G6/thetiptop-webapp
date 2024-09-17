# Stage 1: Build the Angular app
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Install Angular CLI
RUN npm install -g @angular/cli

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Build the Angular app
RUN ng build --prod

# Stage 2: Serve the app
FROM nginx:alpine

# Copy the built app to the Nginx directory
COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html

# Expose port 90
EXPOSE 90

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
