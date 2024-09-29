# Use an official Debian image as a parent image
FROM debian:stable-slim

# Install curl and other dependencies
RUN apt-get update && apt-get install -y \
    curl \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*


# Install Python and other dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Create a virtual environment and install Python dependencies
RUN python3 -m venv venv && \
    . venv/bin/activate && \
    pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
COPY . /app/

# Expose port 4000
EXPOSE 4000

# Define environment variable for Flask
ENV FLASK_APP=run.py

# Activate the virtual environment and run the application
CMD ["/bin/bash", "-c", ". venv/bin/activate && python run.py"]
