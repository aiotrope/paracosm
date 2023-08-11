# paracosm

Boilerplate

## Requisite

Locally installed node package manager and Docker. No need to install MongoDB locally.

## CLI Commands (init setup)

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
npx eslint --init

# install other dev dependencies
npx install-peerdeps --dev eslint-config-airbnb-base && yarn add eslint-config-airbnb-typescript eslint-plugin-prettier eslint-config-prettier

```
## CLI Commands (Common usage)

```bash
# list all images
$ docker image ls

# list all running containers
$ docker container ls
$ docker ps

# list images
$ docker images

# pull from docker registry
$ docker image pull <image>

# list all running & stop containers
$ docker container ls -a
$ docker ps -as

# filter list of containers
$ docker container ls -a | grep <IMAGE>

# remove container by id
$ docker container rm <CONTAINER ID>

# remove all stop containers
$ docker container prune

# remove dangling images
$ docker image prune

# Remove volumes
$ docker volume prune

# remove containers & images
$ docker system prune -a

# Remove image
$ docker image rm <REPOSITORY>:<TAG>
$ docker rmi <IMAGE ID>

# Remove container
$ docker rm <CONTAINER ID>

# run individual container
$ docker run <container_id>

# run container from image
$ docker container run <IMAGE>

# check logs
$ docker logs <container_id>

# stop running container
$ docker container stop <CONTAINER ID>
$ docker kill <CONTAINER ID>

# search for images
$ docker serach <IMAGE>

# build images from docker file from current dir with tag
$ docker build . -t <nominated_image_name>:<nominated_tag_or_version_identifier>
$ docker images
$ docker run -it <REPOSITORY>:<TAG> # run in integrated mode

# docker container prune && docker image prune && docker volume prune && docker system prune -a

```

## CLI Commands (Local environment using Mongodb image)

Edit the `mongodb url env` in `server/src/utils/mongoConnect.ts` file from `environ.MONGODB_URL` to `environ.MONGODB_DEV_URL` to use mongo image as database without dockerizing the whole server app.

```bash
$ cd server && docker-compose up -d
$ yarn run dev
```

## CLI Commands (Dockerize server)

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
