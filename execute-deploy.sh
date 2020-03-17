#!/bin/bash
sudo docker stop maskmap
sudo docker rm maskmap
sudo docker rmi maskmap

sudo docker build -t maskmap .

sleep 5

sudo docker run -d --name maskmap maskmap