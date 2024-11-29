# Build frontend
FROM node:16 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN ls -ltr
RUN npm run build

# Backend setup
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY requirements.txt ./
#RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy frontend build to nginx
COPY --from=frontend-build /app/frontend/build /var/www/html

# Nginx configuration
COPY ./frontend/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start Nginx and FastAPI
CMD service nginx start && uvicorn main:app --host 0.0.0.0 --port 8000