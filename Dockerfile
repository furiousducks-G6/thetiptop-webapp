# Stage 2: Serve the app
FROM nginx:alpine

# Copy built Angular app from the previous stage
COPY --from=build /app/dist/thetiptop-web /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port the app runs on
EXPOSE 80

# Start nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]
