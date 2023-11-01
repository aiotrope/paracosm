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

### CLI Commands (dockerize api)

```bash
# create app-screts dir & include it in .gitignore
mkdir app-secrets

# create secret file & include it in docker compose file; variable name in docker compose should end with a _FILE
echo 'secret_value' > ./app-secrets/secret_value.txt

# build docker images
docker compose up -d --build

# start mongodb shell on running container
$ docker exec -it ContainerName bash
# login to mongosh
$ mongosh "mongodb-uri-string" --username username --password password --authenticationDatabase admin
$ show dbs
$ show collections
$ show tables
$ db.getCollectionNames() # users
$ db.users.find()
$ quit


# clean slate
$ docker system prune -a && docker images prune -a && docker volume prune -a

```
