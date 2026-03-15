FROM php:8.2-apache
RUN a2enmod proxy proxy_http
COPY ./apache-vhost.conf /etc/apache2/sites-enabled/000-default.conf
COPY . /var/www/html/
RUN rm /var/www/html/apache-vhost.conf
RUN rm /var/www/html/Dockerfile
RUN cp /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini
CMD ["apache2-foreground"]