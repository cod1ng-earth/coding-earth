ARG PHP_VERSION=7.2

FROM php:${PHP_VERSION}-cli

ARG GID=1000
ARG UID=1000
ARG APP_ENV=dev
ARG WITH_XDEBUG=false

# Prevent Symfony Flex from generating a project ID at build time
ARG SYMFONY_SKIP_REGISTRATION=1

ENV APP_ENV=${APP_ENV}
ENV APP_PATH=/var/www/app

RUN apt-get update && apt-get install -y \
    zlib1g-dev \
    unzip \
    git \
    bash

RUN docker-php-ext-install -j$(nproc) pcntl zip mbstring exif && docker-php-ext-enable pcntl zip mbstring exif

# Install Composer globally
ENV COMPOSER_ALLOW_SUPERUSER 1
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY docker/php.ini /usr/local/etc/php/php.ini

WORKDIR ${APP_PATH}

COPY composer.json composer.lock ./
# prevent the reinstallation of vendors at every changes in the source code
RUN set -eux; \
	composer install --prefer-dist --no-autoloader --no-scripts --no-progress --no-suggest; \
	composer clear-cache

COPY . ./

#VOLUME ${APP_PATH}

RUN set -eux; \
	mkdir -p var/cache var/log; \
	composer dump-autoload --classmap-authoritative; \
	composer run-script post-install-cmd;
RUN chown -R app:app var; \
	chmod +x bin/console; sync

EXPOSE 3000
CMD ["bin/console", "server:run", "0.0.0.0:3000"]
