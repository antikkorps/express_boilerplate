FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY prisma prisma/

RUN npx prisma generate


# Copy all the file from app
COPY . .


# Expose the port the app runs in
EXPOSE 3000

# CMD to launch the app
CMD [ "node", "dist/server.ts" ]
