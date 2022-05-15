FROM node:16
# Create app directory
WORKDIR /usr/src/app
WORKDIR /usr/src/datacontracts
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# copy data contracts
COPY ./datacontracts/ ../datacontracts/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source
COPY . .
EXPOSE 1004
CMD [ "node", "orders-app.js" ]