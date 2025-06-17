# Use official Node.js LTS version
FROM node:20

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Vite default port
EXPOSE 5173

# Run the dev server
CMD ["npm", "run", "dev"]
