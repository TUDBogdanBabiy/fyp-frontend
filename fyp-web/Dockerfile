FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

COPY quasar.conf.js ./

RUN npm install -g @quasar/cli

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN quasar build -m pwa

EXPOSE 8080
CMD [ "quasar", "serve", "dist/pwa", "-p 8080" ]