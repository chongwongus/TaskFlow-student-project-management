# Use Python 3.11-slim as the base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install Node.js and npm for building the Angular app
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the Angular app source code into the container
COPY client /app/client

# Build the Angular app
RUN cd /app/client && npm install && npm run build --prod

# Create the build directory for the Flask app
RUN mkdir -p /app/build

# Copy the built Angular app into the Flask app's build directory
RUN cp -r /app/client/build/* /app/build

# Copy the Flask application into the container
COPY app.py /app

# Install Flask and any required dependencies
RUN pip install --no-cache-dir flask

# Expose port 5000 for the Flask application
EXPOSE 5000

# Run the Flask application upon container startup
CMD ["python", "app.py"]