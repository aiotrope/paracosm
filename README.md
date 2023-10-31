# reverie
Boilerplate

## Requisite
Locally installed node package manager and Docker. No need to install MongoDB locally.

### Main API Setup

```bash
# start a node project
mkdir server && cd server && yarn init

# Install TS globally
npm i -g typescript

# init TS project
tsc --init --sourceMap --rootDir src/ --outDir dist

# install eslint & prettier
yarn add -D eslint prettier

# init eslint
yarn create eslint --init

```

### CLI Commands (dockerize server)

```bash
# transpile ts code to js and build application as docker image
$ yarn run build
$ docker build -t aiotrope/reverie-server:v1.0.0 .
# list running container
$ docker ps
# list all containers
$ docker ps -as
# list images
$ docker images
# run the containerized app at port 8080
$ docker run --publish 8080:8080 aiotrope/reverie-server:v1.0.0
# stop running containers
$ docker kill <container_id>
# run container from the image
$ docker run -it -p 8080:8080 --name <any_nominated_name> --rm aiotrope/reverie-server:v1.0.0
```
