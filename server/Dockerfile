FROM node:lts-bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN yarn install --frozen-lockfile --production

EXPOSE 8080

USER node

CMD ["dumb-init", "node", "dist/index.js"]
