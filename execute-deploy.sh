#!/bin/bash
sudo docker stop server1
sudo docker cp /home/ubuntu/travis/maskMap/target/maskmap-0.0.1-SNAPSHOT.jar server1:/


sudo docker start server1

# sleep 5

# sudo docker stop server2
# sudo docker cp /home/ubuntu/travis/maskMap/target/maskmap-0.0.1-SNAPSHOT.jar server2:/


# sudo docker start server2

# sleep 5

# sudo docker stop server3
# sudo docker cp /home/ubuntu/travis/maskMap/target/maskmap-0.0.1-SNAPSHOT.jar server3:/


# sudo docker start server3

# sleep 5

# sudo docker cp /home/ubuntu/travis/maskMap/target/maskmap-0.0.1-SNAPSHOT.jar server4:/

# sudo docker stop server4

# sudo docker start server4

