# Use the official Node.js 18 Alpine image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application code to the container
COPY . .

# Expose port 8080 for the backend service
EXPOSE 8080

# Define environment variable for production
ENV NODE_ENV=production

# Command to run the backend application
CMD ["node", "server.js"] 
