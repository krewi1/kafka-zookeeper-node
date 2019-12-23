# TESTING repo
This repo is made for testing purposes to play with zookeeper, kafka in k8s. There is node implementation of 
kafka consumer and publisher. And also zookeeper.

## Run project

### Compose
To run only using docker/docker-compose run
```
docker-compose up
```
in root directory. It will pull image from docker hub. If you wanna play with that project simply build your own image using
```shell script
docker build -t company/image .
docker push company/image
```
and replace reference to my container in service.yaml with your image.

### Kubernetes cluster
There are 3 services => zookeeper, kafka, node. Kafka is dependant on zookeeper and node on kafka and zookeeper.
First start statefulset and service for zookeeper with
```shell script
kubectl apply -f zookeeper/zookeeper.yaml
```
When done start kafka
```shell script
kubectl apply -f kafka/kafka.yaml
```
Last but not least run node service
```shell script
kubectl apply service.yaml
```

