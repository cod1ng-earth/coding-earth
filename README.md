### Requirements
##### the absolute **minimal** requirements are
- git
- [the platformsh client](https://docs.platform.sh/gettingstarted/cli.html) (requires php)
- an account with access [to our platformsh project](https://console.platform.sh/robertdouglass/ulyecw4ca3wk6)
- a great [code editor](https://code.visualstudio.com/) 

using only these will allow you to write code locally, push it to your own platform.sh environment and run it there. Doing things this way is quite cumbersome because it's taking some time until platform.sh has built and released your application and it doesn't provide any remote debugging features out of the box. if you want to test drive like that, jump to the next section but we suggest that you install:   

##### the minimal requirements
this project consists of several microservices which may be written in many languages and can depend on resources like MySQL or Elasticsearch. If you only want to write a microservice that delivers data when getting a request, you can install its language requirements (like php, node, python, go). You don't necessarily have to install the resource requirements (like MySQL) locally because platform.sh allows you to connect to their environments' resources via an SSH tunnel. The only major dependency besides your favorite language we're relying on is

- [nodejs](https://nodejs.org/en/) (if you want to avoid littering your local machine set it up using [nvm](https://github.com/nvm-sh/nvm))

If you want to improve the frontend code (the `scaffolding` app), checkout the paragraphs at the very bottom of this text. You'll only need node / yarn and an environment with a working coordinator for this.

##### go with Docker to run the whole thing
The whole project **can** be run on your local machine using Docker and docker-compose. That's a pretty advanced usecase to test the system as a whole. Find instructions on how to do that at the very bottom. If you just want to hack on the microservice part, you can *safely ignore all of the .env, localEnv, Dockerfile, docker-compose.yml files* and the web folder (it's a local reverse proxy). It's for unicorns anyway.

### Getting started 
Follow the instructions on platform.sh's [Getting Started](https://docs.platform.sh/gettingstarted/tools.html) page. They basically boil down to authenticating with platform.sh using the CLI client (`platform` and follow instructions) and adding your public SSH key to the project (can be done via the web interface or CLI with `platform ssh-key:add` which even creates a keypair if you have none).

Get the project's sources from platform.sh (does a git clone under the hood)

`platform get <platform project id>`

Given that you have installed PHP and node.js on your local machine you can follow the instructions:

```bash
cd dev-day-coding-challenge
platform build
``` 

This will install dependencies and build all applications and microservices **locally** on your machine and symlink them into a new `_www` folder. NOTICE: Symfony's base requirements already break this default build (since it might miss the php-xml package, that you can install on Ubuntu with `apt-get install php-xml`). If you want, you can start fixing that, but we suggest that you start getting your hands dirty:

### See the running application
`platform url` displays a list of available endpoints. Currently we see 10 of them, 5 secured with SSL and 1 redirecting to another. These are our 4 base applications:

- **coordinator** is responsible for "coordinating" the microservices with the frontend code (and with each other)
- **scaffold** is a React based frontend application that requests data from all other microservices by asking **coordinator** what's available
- **rssreader** reads an rss (regularly), stores its result in an ElasticSearch index and yields the latest news
- **calendarservice** is a dumb (your turn!) PHP/Symfony4.2 service that yields a list of days of the current month.

Select the **rssreader** for now. A new browser window should open and display its RSS response. Try that with any of them.  

### Fork, change and deploy
When forking an environment, platform.sh creates a **complete** (!) clone of it, all its apps and its dependencies to a new environment. Lets try to change an existing service.

`platform branch messagerss` (use any name you like)

A lot should happen on your console now: that's platform.sh's builder building your clone of the master branch. Don't watch it but start hacking:

- open rssreader/index.js
- add another field in its output (e.g. a string message): 

```js
const response = {
    message: "Pray to the Demo Gods",
    news: result.body.hits.hits.map(h => h._source)
  };
``` 

and commit it (use the IDE or `git commit -am "added message"`). Now you're ready to push that change: `platform push`. Platform.sh will only rebuild the rssreader app in back in some seconds. With `platform url` you can display the individual URLs of your environment again and open the rssreader application again. NOTICE: if you see a big fat security warning, that's because LetsEncrypt certificates need some time to propagate. Try to find the "Accept the risk" button (it's your code!) and go ahead.

## Run an application locally with tethered resources
If you try to run the rssreader application locally (`npm run start`) it will fail since you (most likely) don't have its ElasticSearch resource dependency at hand. The mechanisms of how environment variables are exposed to services [are explained in the platform.sh docs](https://docs.platform.sh/gettingstarted/local/tethered.html#quick-start) but here's the short story (using env vars that litter your local cli session):

```bash
platform tunnel:open && export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
```

Run `npm run start` again and you'll see the output that you expect.

Once you're satisfied with the results you can ask the project maintainer to merge your environment into master (`platform merge`) and start the process again. For now, just remove the environment you just forked (`platformplatform environment:delete`), switch back to master (`platform environment:checkout master`) and create something new:

## Create a new microservice application
Platform.sh relies on routing- , services-, and local file descriptions that define how an applications' services are built, mounted to a reverse proxy and interact with their resources. You can find all the details [in their docs](https://docs.platform.sh/overview/structure.html) but we want to get you started quickly, so we've built a bash script that creates a minimal set for a new application right away. 

Create a new environment (see above), change to the project root and run

`./new.sh fortune`

That should give you a `fortune` directory containing a `platform.app.yaml`, a new "fortune" route in the `.platform` directory's routing descriptor and docker and proxy definitions (explained further below and **only** needed for a complete local setup).

Now it's up to you to decide your favorite language and checkout the samples over at platform.sh's [language samples directory](https://github.com/platformsh/language-examples). Make sure to check the local `platform.app.yaml` files to define how your application is supposed to run. 

## Running all services locally
Since we're going to build a lot of small applications that will be bound together in a monolithic frontend, it's not really feasible to launch them one by one, remember ports and configure them accordingly. That's why we have prepared a docker/compose environment that should enable you to run **everything** locally inside Docker containers. Here be dragons. You'll also need a local *node* installation from here on. 

- On Linux you can't simply mount a service on port 80 without root implications, so first copy the `.env.dist` file in the project root to an `.env` file and change the port (or leave it as 8000)
- `make prepare` creates environment files in the coordinator directory. By default everything will run on `devday.local`, if you want to change that, edit the generated `coordinator/.env` file's `DEFAULT_HOST` entry now. 
- `make coordinator` does quite frankly what platform.sh is doing remotely: it scans directories for platform.app.yamls and generates routing information available to all other applications. We're exposing that (as platform.sh does remotely) as b64 encoded env var `$PLATFORM_ROUTES`
- `make start` pulls images, installs dependencies and starts all services. This takes around 10 minutes.
- add localhost aliases for all services to your /etc/hosts file. At the time of writing this would look like:

if everything goes well, you should be able to visit `http://devday.local:8000` (whatever port you chose) and see the freshly built frontend consuming Docker based microservices as exposed by your local coordinator service (`coordinator.devday.local:8000`)

#### Some Docker hints
- `docker-compose exec <container> sh`: get a shell on a running container
- `docker-compose restart <container>`
- `docker-compose logs <container>`
make sure to also check the `Makefile` for more insights.

## Frontend development
For the "scaffold" we decided to go with React based frontend because... React. It's based on CRA so you can build and start it locally using `yarn run start`. If you're on Docker, it's started in dev mode behind the scenes already including full HMR capabilities. If you're **not** on Docker and do not care about how the microservices work but directly want to connect your current platform.sh's environment, simply create a  copy the `scaffold/.env.dist` file to a `.env` file and change the `REACT_APP_COORDINATOR` to your current environment's coordinator URL. If you really don't care, you can simply connect to the production application: `REACT_APP_COORDINATOR=https://coordinator.devday.tk` 

#### The flow of data
The first thing React does, is getting routes from your local coordinator (`src/coordinator`). Once responded it iterates over all service definitions and renders a `BuildComponent` for it. That one tries to find a dedicated frontend component for the service. If it can't find any it falls back to a display of the service's JSON response.

The dedicated components receive the service's URL as property that's used by the common `componentData` helper to load API data from the service. Each component then is responsible for making sense of the data.

## Troubleshooting
##### the frontend looks so empty.
maybe your coordinator isn't configured correctly? check `coordinator/.env`'s DEFAULT_HOST. If your local setup runs on `devday.local:8000` it also should point to  `devday.local:8000`. You can call `make coordinator` to recreate the env file and its decoded contents. 

##### I change code but nothing changes
Are you coming from a PHP background? Node.js and many other languages basically need to be restarted to reflect code changes (some frameworks like zeit/micro-dev can do that automatically). When you run in Docker, you can restart them with `docker-compose restart <container>`

#### There are no news in the rss reader 
We're storing all news that have been fetched from an RSS feed in Elasticsearch. On platform.sh that happens through cron. On your local environment you're on your own :) Execute the `rssreader/bin/readFeeds.js` file to populate the database. Make sure to copy the .env.dist file to a local .env file. 

#### Beware of CORS!
Since we're connecting all microservices from the client side, they must send appropriate CORS headers on every request. This cannot be handled transparently by the platform.sh proxies so you have to take care on your own. If you write an express app, checkout their cors middleware, if you're in PHP nelmio/cors is your best friend but you can also set the headers manually (see `rssreader/index.js`). For the time being it's toally fine to set the `Access-Control-Allow-Origin` header to `*` but that of cors(!) must be changed when going live for real. 

#### I'm getting certificate warnings on all https endpoints :(
Have you tried shutting it off and on again? In platform.sh terms that's a `platform redeploy`. By issuing that command new certificate challenges are executed against Lets Encrypt. 

#### Error: watch ... ENOSPC
Uhoh, you ran out of system resources (node_modules, Visual Studio and Docker together can run into this pretty soon). Check this [StackOverflow question](https://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc/17437601#17437601).



