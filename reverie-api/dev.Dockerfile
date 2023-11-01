FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN yarn install

ENV NODE_ENV development

EXPOSE 8080

# USER node

CMD ["yarn", "dev"]