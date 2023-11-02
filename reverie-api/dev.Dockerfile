FROM node:lts-alpine

WORKDIR /app

COPY --chown=node:node . .

RUN yarn install --frozen-lockfile

ENV NODE_ENV development

EXPOSE 8080

USER node

CMD ["yarn", "dev"]