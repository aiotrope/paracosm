# paracosm
Boilerplate

## CLI Commands (setup)

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