#!/bin/bash
sudo docker stop maskmap
sudo docker rm maskmap
sudo docker run -d --name maskmap -p 80:80 springboot-mask