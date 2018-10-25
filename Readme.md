Project in development yo can send improvments and ideas to sendoamoronta@gmail.com
## Requisites
- docker
- docker-compose 
- docker-machine
- node
- VirtualBox and VBoxManage

## Environment
```
export KAFKA_HOST=#your local ip
export KAFKA_PORT=9092 #default
```
## Launch Kafka and zookeeper in docker containers 
```
docker-machine create --driver virtualbox --virtualbox-memory 6000 ap-kafka	

eval $(docker-machine env ap-kafka)

docker-compose up -d
```
Add more brokers
```
docker-compose scale kafka=3
```

Stop Kafka and zookepper
```
docker-compose down
```

## Launch the app server to receive notifications
```
npm run app
```
## Launch processor to catch evt__events and send to topic
```
npm run processor
```
## Launch location process to enrich ip location node
```
npm run location
```
## Launch the process to send http post events
```
npm run post_deliver
```
## Launch the process to send mail post events
```
npm run mail_deliver
```

## Utils
Get the broker IP:
```
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' kafka_kafka_1
```
First install librdkafka
```bash
git clone https://github.com/edenhill/librdkafka
cd librdkafka
./configure
make
make install
ldconfig
```

## Next steps
- Refactor/clean/test code and improvments
- Metrics of deliver (time, count, ...)
- Dockerize all node components
