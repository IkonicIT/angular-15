# Use a more recent Node.js version
FROM node:16-alpine AS builder

# Set the working directory
WORKDIR /angular-14-migration

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with --legacy-peer-deps to resolve conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build --prod --aot=false

# Use a lightweight Nginx image to serve the application
FROM nginx:1.15.8-alpine

# Copy the built application from the builder stage
COPY --from=builder /angular-14-migration/dist/* /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]