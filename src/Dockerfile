# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose port 3000
EXPOSE 3000
