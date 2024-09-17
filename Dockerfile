# Stage 1: Build the Angular app
FROM node:18 AS build

WORKDIR /app

# Install Angular CLI
RUN npm install -g @angular/cli

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Angular app
RUN ng build --configuration production

# Stage 2: Serve the app
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
