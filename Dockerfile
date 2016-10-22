FROM node:4

RUN npm install -g nodemon

ENV MONGODB_URI "mongodb://csf:naicsf@ds061196.mlab.com:61196/csf"
ENV PORT 8080
ENV SESSION_SECRET "fff365442c699e37b29541711a79b161d3e4bba7677eac6d0722e742e9dfe4a9"


EXPOSE 8080
