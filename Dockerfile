FROM node:8-alpine

RUN apk --no-cache add \
      bash \
      g++ \
      ca-certificates \
      openssl \
      make \
      python 
#add git if is neccesary clone librdkafka

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json /usr/app/
COPY . /usr/app
RUN npm install

#RUN git clone https://github.com/edenhill/librdkafka
#RUN cd librdkafka && ./configure && make && make install && ldconfig