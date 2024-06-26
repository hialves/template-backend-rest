FROM node:18-alpine AS development

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]