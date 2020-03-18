#!/bin/bash
sudo docker cp /home/ubuntu/travis/maskMap/target/*.jar server1:/

sudo docker stop server1

sudo docker start server1

sleep 5

sudo docker cp /home/ubuntu/travis/maskMap/target/*.jar server2:/

sudo docker stop server2

sudo docker start server2

sleep 5

sudo docker cp /home/ubuntu/travis/maskMap/target/*.jar server3:/

sudo docker stop server3

sudo docker start server3

sleep 5

sudo docker cp /home/ubuntu/travis/maskMap/target/*.jar server4:/

sudo docker stop server4

sudo docker start server4

