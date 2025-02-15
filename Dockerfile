# Base image
FROM node:22-alpine

# Define variables
ARG APP_NAME

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle remaining app source
COPY . .

# Copy client directory for digital-zone app
COPY ./apps/digital-zone/client/ ./dist/apps/digital-zone/client/

# Creates a "dist" folder with the production build
RUN npm run build -- ${APP_NAME} && npm run build:client

# Start the server using the production build
CMD [ "node", "dist/apps/${APP_NAME}/main.js" ]