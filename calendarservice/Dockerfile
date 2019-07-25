ARG PHP_VERSION=7.3

FROM php:${PHP_VERSION}-cli-alpine AS php

ARG GID=1000
ARG UID=1000
ARG APP_ENV=dev

# Prevent Symfony Flex from generating a project ID at build time
ARG SYMFONY_SKIP_REGISTRATION=1

ENV APP_ENV=${APP_ENV}
ENV APP_PATH=/var/www/app

RUN apk add --no-cache \
		acl \
		file \
		gettext \
		unzip \
		git \
		bash \
		postgresql-client \
	;


ARG APCU_VERSION=5.1.12
RUN set -eux; \
	apk add --no-cache --virtual .build-deps \
		$PHPIZE_DEPS \
		icu-dev \
		libzip-dev \
		postgresql-dev \
		zlib-dev \
	; \
	\
	docker-php-ext-configure zip --with-libzip; \
	docker-php-ext-install -j$(nproc) \
		intl \
		pdo_pgsql \
		zip \
	; \
	pecl install \
		apcu-${APCU_VERSION} \
	; \
	pecl clear-cache; \
	docker-php-ext-enable \
		apcu \
		opcache \
	; \
	\
	runDeps="$( \
		scanelf --needed --nobanner --format '%n#p' --recursive /usr/local/lib/php/extensions \
			| tr ',' '\n' \
			| sort -u \
			| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
	)"; \
	apk add --no-cache --virtual .api-phpexts-rundeps $runDeps; \
	\
	apk del .build-deps


COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY docker/php.ini /usr/local/etc/php/php.ini

# Install Composer globally
ENV COMPOSER_ALLOW_SUPERUSER 1

RUN set -eux; \
    composer global require "symfony/flex" --prefer-dist --no-progress --no-suggest --classmap-authoritative;
ENV PATH="${PATH}:/root/.composer/vendor/bin:./vendor/bin"

WORKDIR ${APP_PATH}

COPY composer.json composer.lock symfony.lock ./
# prevent the reinstallation of vendors at every changes in the source code
RUN set -eux; \
	composer install --prefer-dist --no-autoloader --no-scripts --no-progress --no-suggest; \
	composer clear-cache

COPY . ./

RUN set -eux; \
	mkdir -p var/cache var/log; \
	composer dump-autoload --classmap-authoritative; \
	composer run-script post-install-cmd;

RUN addgroup -S --gid "$GID" appgroup \
    && adduser -S appuser -G appgroup \
    --uid "$UID" \
    --disabled-password


RUN chown -R appuser:appgroup ${APP_PATH}; \
    chown -R appuser:appgroup ${APP_PATH}/var; \
	chmod +x bin/console; sync

#VOLUME ${APP_PATH}
USER $UID:$GID

EXPOSE 3000
CMD ["bin/console", "server:run", "0.0.0.0:3000"]

