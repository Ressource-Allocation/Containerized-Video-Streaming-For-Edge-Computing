
# Client Html player

## Using

To be used with nginx docker image.
For now use a normal nginx image. A customized one will be created with the player.html.
Plays random videos from a declared playlist. 


Pull an nginx image and run it:
```
sudo docker run -d -p 80:80 --name nginx nginx
sudo docker exec -it nginx /bin/bash
```
Install on it wget to pull the index.html from our GutHub:
```
apt-get update
apt-get install wget
wget https://github.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/raw/master/Client/index.html
cp index.html /usr/share/nginx/
```
You can then open the player in a web browser on localhost.
