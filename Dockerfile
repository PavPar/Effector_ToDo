FROM node:16-alpine 
WORKDIR /usr/src/app

COPY . .

RUN npm i package.json
CMD ["npm","run","start"]

EXPOSE 3000
