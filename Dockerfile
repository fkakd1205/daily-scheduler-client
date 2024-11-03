FROM node:20.3.1-alpine

RUN npm install -g serve
WORKDIR /app
COPY ./build .

EXPOSE 3000
ENTRYPOINT ["serve","-s","."]