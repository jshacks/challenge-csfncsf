FROM node:4

RUN npm install -g nodemon

ENV MONGODB_URI "mongodb://mongo:27017/?replicaSet=csf"
ENV PORT 8080
ENV SESSION_SECRET "fff365442c699e37b29541711a79b161d3e4bba7677eac6d0722e742e9dfe4a9"

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x entrypoint.sh

ENTRYPOINT /entrypoint.sh