MAKE = make --no-print-directory
DOCKER = docker
DOCKER_COMPOSE = docker-compose
UNAME := $(shell uname)
UID := $(shell id -u)
GID := $(shell id -g)
# Add the following 'help' target to your Makefile
# And add help text after each target name starting with '\#\#'
# A category can be added with @category
HELP_FUN = \
	%help; \
	while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-]+)\s*:.*\#\#(?:@([a-zA-Z\-]+))?\s(.*)$$/ }; \
	print "usage: make [target]\n\n"; \
	for (sort keys %help) { \
	print "${WHITE}$$_:${RESET}\n"; \
	for (@{$$help{$$_}}) { \
	$$sep = " " x (32 - length $$_->[0]); \
	print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
	}; \
	print "\n"; }

# Process parameters/options
CONTAINERS := web elasticsearch zookeper kafka frontend coordinator rssreader calendar comics rabbithole

help: ##@other Show this help.
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST)
.PHONY: help

prepare: ##@setup copy env files and build coordinator env
	cp .env.dist .env
.PHONY: prepare

setup: build-images dependencies ##@setup Create dev enviroment
.PHONY: setup

dependencies: ##@development install local dependencies
	$(DOCKER_COMPOSE) run calendar composer install
	$(DOCKER_COMPOSE) run rssreader npm install
	$(DOCKER_COMPOSE) run tweets npm install
	$(DOCKER_COMPOSE) run rabbithole npm install
	$(DOCKER_COMPOSE) run comics npm install
	$(DOCKER_COMPOSE) run coordinator npm install
	$(DOCKER_COMPOSE) run frontend yarn install

.PHONY: dependencies

build-images: ##@setup build docker images
	$(DOCKER_COMPOSE) build --build-arg UID=$(UID) --build-arg GID=$(GID)
.PHONY: build-images

rebuild: ##@setup removes images
	$(DOCKER_COMPOSE) down --rmi all
	$(MAKE) setup
.PHONY: rebuild

clean: ##@setup stop and remove containers
	$(MAKE) stop
	$(DOCKER_COMPOSE) down --remove-orphans
.PHONY: clean

start: ##@development start containers
	$(DOCKER_COMPOSE) up -d
.PHONY: start

stop: ##@development stop containers
	$(DOCKER_COMPOSE) stop -t 1
.PHONY: stop

restart: stop start ##@development restart containers
.PHONY: restart

logs: ##@development show server logs (default: 0, use parameter 'tail=<#|all>, e.g. call 'make logs tail=all' for all logs, add `make logs tail=10' or any number for specific amount of lines)
	$(DOCKER_COMPOSE) logs -f --tail=$(LOGS_TAIL)
.PHONY: logs

stats: ##@development show information about running Docker containers
	$(DOCKER) stats --format "table {{.Container}}\t{{.Name}}\t{{.CPUPerc}}\t{{.MemPerc}}\t{{.BlockIO}}"
.PHONY: docker-stats

cli: ##@development get shell in a container (defaults: cli (container), /bin/sh (shell), add 'container={container}' to use different container, e.g. 'make cli container=postgres', add 'shell={shell}' to use different shell, e.g. 'make cli shell=/bin/bash')
	$(DOCKER_COMPOSE) exec $(CONTAINER) sh
.PHONY: cli

update-containers: build-images start ##@development updates containers
.PHONY: update-containers







