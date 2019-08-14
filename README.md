# hub.coding.earth

The coding.earth hub is a place to aggregate meaningful content for developers. It's composed of small services that respond with pieces of content. The hub website stitches them together using a monolithic frontend application.

The hub is deployed on [platform.sh](platform.sh), so if you want to hack on it, we recommend forking an environment over there. You can also run the whole thing locally on Docker, but be prepared to look into its guts if something goes wrong.

# Requirements

## the **absolutely minimal** requirements

- git
- [the platformsh client](https://docs.platform.sh/gettingstarted/cli.html) (requires php)
- an account with access [to our platformsh project](https://console.platform.sh/robertdouglass/ulyecw4ca3wk6)
- a great [code editor](https://code.visualstudio.com/)

with that setup you can write code locally, fork and push to your very own platform.sh environment and run it there.

## the **slightly higher minimal** requirements

It's taking some time until platform.sh has built and released your code, therefore we suggest to at least install your micro application's language stack locally. Depending on the code you plan to write that could be Ruby, Python, node.js, PHP, Java or Go. You don't have to install MySQL, Redis or Elasticsearch locally because platform.sh allows you to tunnel to your environments' resources via SSH (try `platform tunnel:open` ). We definitely recommend installing **node.js** locally because the central coordinator component is built on it:

- [nodejs](https://nodejs.org/en/) (if you want to avoid littering your local machine set it up using [nvm](https://github.com/nvm-sh/nvm))

If you want to work on the **frontend code** (the `frontend` app), checkout the README.md in the `frontend` directory. You'll only need node / yarn to build and serve it. You can simply connect it to a working coordinator (but try to avoid writing onto our master environment https://coordinator.coding.earth).

# Getting started

Follow the instructions on platform.sh's [Getting Started](https://docs.platform.sh/gettingstarted/tools.html) page. They boil down to authenticating with platform.sh using the CLI client (`platform`) and adding your public SSH key to the project (`platform ssh-key:add`).

Get the project's sources from platform.sh (it's a `git clone` under the hood):

`platform get <platform project id>`

The default branch that's checked out is unsurprisingly `master`. You should use that as starting point for your own environment. Fork your own branch / environment with

`platform branch <a good name>`

This will create a branch, push it to platform.sh and trigger a full deployment of your new environment. When forking an environment, platform.sh creates a **complete** (!) clone of it, all its apps and its dependencies and exposes it as new environment to the web.

You can now cd into an application's folder and start adding features to it or create a new one. Every time you `platform push` new commits, your environment will be rebuilt.

### Access the running applications

`platform url` displays a list of available endpoints. There are 2 fundamental and 2 demo apps available:

- **coordinator** is responsible for "coordinating" the microservices with the frontend code. It's based on node.js / express. Also acts as common gateway of input requests.
- **frontend** is a React based frontend monolith that requests information about all available microservices from **coordinator**.
- **tweets** listens on Kafka for messages on topic `NewUrl` . If it's a tweet/status, gets its data from the official Twitter API and dispatches a `NewContent` message. Listens on itself for it and indexes it into Elasticsearch.
- **calendar** is a service that you can query with dateranges for a list of events. Support several "backends", currently only a github based conference list is available. Written in PHP using Symfony 4.2
- (there still is a sample **rssreader** app that demonstrates cron, sqlite / file system and Elasticsearch usage but it's not operational. Built on node.js)

If you're doing local development, you can access all these applications on their respective subdomains of the same name on your environment url. E.g. `tweets.cearth.local:8000`.

### Make a change and deploy

Lets try to change an existing service. First, create a new environment:

`platform branch <xyz>-rss` (use any branch name you like)

While platform.sh starts building your clone of master you can already start hacking:

- open `rssreader/routes/search.js`
- add another field to its output (e.g. a string message):

```js
const response = {
  message: "Pray to the Demo Gods",
  news: result.body.hits.hits.map(h => h._source)
};
```

and commit it (use your IDE or `git commit -am "added message"`). Now you're ready to push that change with `platform push`. Platform.sh will only rebuild the rssreader app since nothing else has changed. With `platform url` you can display the individual URLs of your environment and access your very own version of the rssreader application.

### Run an application locally with tethered resources

If you try to run the rssreader application locally (`npm run start`) it will fail since you most likely don't have Elasticsearch installed locally. The good news: you can simply connect your locally built application to the remote Elasticsearch instance that platform.sh has provisioned for your environment:

```bash
platform tunnel:open && export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
```

Run `npm run start` again and you'll see the output that you expect. The mechanisms of how environment variables are exposed to services are explained in detail [in the platform.sh docs](https://docs.platform.sh/gettingstarted/local/tethered.html#quick-start).

### Creating a new application

Platform.sh relies on routing- , services-, and local file descriptions that define how an application's services are built, mounted to their request gateway and which resources it relies on. You can find all the details [in their docs](https://docs.platform.sh/overview/structure.html) but to get started quickly, we've built a bash script that creates a minimal set for a new application right away.

Create a new environment (see above), change to the project root and run

`./new.sh fortune`

This should give you a `fortune` directory containing a `platform.app.yaml`, a new "fortune" route in the `.platform` directory's routing descriptor (you can safely remove / ignore the docker and proxy definitions - they're **only** needed for a completely local setup).

Now it's up to you to decide your favorite language and checkout the samples over at platform.sh's decent [language samples repository](https://github.com/platformsh/language-examples). Look into the local `platform.app.yaml` files to define how your application is supposed to run.

### Going live / merging upstream

Once you're satisfied with the results you can ask the project maintainer to merge your environment into master (`platform merge`). You can remove an environment with `platform environment:delete` or switch back to master `platform environment:checkout master`.

# Build all services locally

In the unlikely case that you have installed all language dependencies on your local machine you can follow the instructions:

```bash
cd dev-day-coding-challenge
platform build
```

This will install dependencies and build all applications **locally** on your machine and symlink them into a new `_www` folder. NOTICE: Symfony's base requirements quite likely already break this default build (since it might miss the php-xml package, that you can install on Ubuntu with `apt-get install php-xml`). If you want, you can start fixing that, but it's much nicer to run them on Docker instead.

## Run everything locally with Docker

**If you just want to hack on the microservices or the frontend, you can safely ignore all of the .env, localEnv, Dockerfile, docker-compose.yml files and the web folder.**

Since we're going to build a lot of small applications that will be bound together in a monolithic frontend, it's not really feasible to launch them one by one, remember ports and configure them accordingly. That's why we have prepared a docker environment that should enable you to run everything locally inside docker containers. You'll also need a local _node_ installation from here on.

### Use the Makefile

- Given you're running some Linux or BSD (macOS) machine, check that you can run `make` or install it (`sudo apt install make`)
- `make prepare` copies local environment files in your root directory (`.env`). It e.g. contains port and default domain configuration picked up by docker; by default everything will run on `cearth.local:8000`. If you want to change that, edit the `.env` file's `DEFAULT_HOST` entry in your root folder. On Linux you can't simply mount a service on port 80 without being root, that's why our default is 8000
- `make setup` pulls images, installs dependencies and starts all services by calling `docker-compose up`. On a fresh setup this takes around 10 minutes.
- add localhost aliases for all services to your `/etc/hosts` file. At the time of writing this would look like:

```text
127.0.0.1 cearth.local
127.0.0.1 coordinator.cearth.local
127.0.0.1 frontend.cearth.local
127.0.0.1 rssreader.cearth.local
```

if everything goes well, you should be able to visit `http://cearth.local:8000` (whatever port you chose) and see the freshly built frontend consuming Docker based microservices as exposed by your local coordinator service (`coordinator.cearth.local:8000`)

#### Some Docker hints

- `docker-compose exec <container> sh`: get a shell on a running container
- `docker-compose restart <container>`
- `docker-compose logs <container>`
  make sure to also check the `Makefile` for more insights.

# Frontend development

please check the README.md in `./frontend`

# Troubleshooting

## I change code but nothing changes

Are you coming from a PHP background? Node.js and many other languages basically need to be restarted to reflect code changes (some frameworks like zeit/micro-dev can do that automatically). When you run in Docker, you can restart them with `docker-compose restart <container>`

## There are no news in the rss reader

We're storing all news that have been fetched from an RSS feed in Elasticsearch. On platform.sh that happens through cron. On your local environment you're on your own :) Execute the `rssreader/bin/readFeeds.js` file to populate the database. Make sure to copy the .env.dist file to a local .env file. You can also execute it directly in your environment's instance by sshing into it (`platform ssh`)

#### Beware of CORS!

Since we're connecting all microservices from the client side, they must send appropriate CORS headers on every request. This cannot be handled transparently by the platform.sh proxies so you have to take care on your own. If you write an express app, checkout their cors middleware, if you're in PHP nelmio/cors is your best friend but you can also set the headers manually (see `rssreader/index.js`). For the time being it's toally fine to set the `Access-Control-Allow-Origin` header to `*` but that of cors( :P ) must be changed when going live for real.

#### I'm getting certificate warnings on all https endpoints :(

Have you tried shutting it off and on again? In platform.sh terms that's a `platform redeploy`. By issuing that command new certificate challenges are executed against Lets Encrypt.

#### Error: watch ... ENOSPC

Uhoh, you ran out of system resources (node_modules, Visual Studio and Docker together can run into this pretty soon). Check this [StackOverflow question](https://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc/17437601#17437601).

#### get the host's ip from inside a docker container

`ip route show default | awk '/default/ {print $3}'`

#### I have to be root to execute this

On Linux boxes docker is operating as root. We actually added local users in all dockerfiles that should map to your local user UID/GID, so root issues shouldn't occur at all! If you're not using our Makefile you must ensure to hand over your local UID/GID as **build arguments** to the docker image builder. When using `docker-compose` that can be achieved like (you can find your local user and group id by simply executing `id`):

`docker-compose build --build-arg UID=1001 --build-arg GID=1001`

