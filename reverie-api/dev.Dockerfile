FROM node:lts-bullseye-slim

WORKDIR /app

ENV NODE_ENV development

# ENV PATH /app/node_modules/.bin:$PATH

# COPY --chown=node:node . .

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8080

# USER node

CMD ["yarn", "dev"]