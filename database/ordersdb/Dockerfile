FROM mysql
# Add a database
ENV MYSQL_ROOT_PASSWORD 12345678
# Add the content of the sql-scripts/ directory to your image
# All scripts in docker-entrypoint-initdb.d/ are automatically
# executed during container startup
COPY ./ordersdb.sql /docker-entrypoint-initdb.d/
EXPOSE 3308
