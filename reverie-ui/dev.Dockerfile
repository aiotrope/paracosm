FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV development

ENV PATH /app/node_modules/.bin:$PATH

COPY . .

RUN yarn install

EXPOSE 5173

CMD ["yarn", "dev"]