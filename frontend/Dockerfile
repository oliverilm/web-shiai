# Use a slim Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy remaining app files
COPY . .

# Expose port for development server
EXPOSE 5173

# Start the development server
CMD [ "npm", "run", "dev", "--host"]