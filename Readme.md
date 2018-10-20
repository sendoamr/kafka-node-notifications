Project in development
## Requisites
- docker
- docker-compose 
- docker-machine
- node
- VirtualBox and VBoxManage

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

#Launch the circuit services
```
npm run app
npm run event_processor
npm run enricher
npm run deliver
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