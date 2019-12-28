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
There are 3 main services and one helper => zookeeper, kafka, node. Kafka is dependant on zookeeper and node on kafka and zookeeper.
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
kubectl apply -f service.yaml
```
For helper which can be use for dns/network testing or for cURLing services run 
```shell script
kubectl apply -f jumpbox/jumpbox.yaml
```

### Up and running cluster
When everything is running as expected node service is listening for https orders.

#### Kafka testing
Connect to jumpbox with
```shell script
kubectl exec -it nameofjumpboxpod -- /bin/sh
```

and watch logs on node pods
```shell script
kubectl logs pod/nameoffirstnodepod -f
kubectl logs pod/nameofsecondnodepod -f
```
Theese pods have to be run in different terminals because its forwarding logs to current terminal. After that just curl to node service 
```shell script
curl -d '{"message":"Hello world"}' -H "Content-Type: application/json" -X POST http://rest:3000/topic1
curl -d '{"message":"Hello world"}' -H "Content-Type: application/json" -X POST http://rest:3000/topic2
```
and after a moment there should be a message at terminal which is watching the node logs.

---
**TROUBLESHOOT**
If there is problem with dns resolution from jumpbox but you can still ping cluster ip of node service, add record to /etc/hosts
node.service.ip.address rest
---
