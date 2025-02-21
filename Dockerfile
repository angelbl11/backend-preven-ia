# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the entire project (including `src/`)
COPY . .

# Change the working directory to `src/`
WORKDIR /usr/src/app/src

# Expose the port (Railway assigns one dynamically)
EXPOSE 3000

# Set environment variables (Railway provides them automatically)
ENV PORT=3000

# Define the command to run the application
CMD ["node", "server.js"]