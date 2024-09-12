# Use the official MySQL image from Docker Hub
FROM mysql:8.0

# Set the root password (replace 'yourpassword' with a strong password)
ENV MYSQL_ROOT_PASSWORD=1234

# Create the database on startup
ENV MYSQL_DATABASE=mockdata

# Copy an existing SQL script (if you have one) to initialize the database
# Uncomment and modify the line below if you have a script
# COPY init.sql /docker-entrypoint-initdb.d/