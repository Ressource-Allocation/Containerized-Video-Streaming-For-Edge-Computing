
# Client Html player

## Using

To be used with nginx docker image.
For now use a normal nginx image. A customized one will be created with the player.html.
Plays random videos from a declared playlist. 

 * Create web server:   docker run --name nginx -d -p 80:80 nginx
 * Run container:   docker run --name nginx -d -p 80:80 nginx
 * Go to directory inside the container : docker exec -it nginx /bin/sh, cd /usr
 * install :  apt-get update && apt-get install wget -y && apt install vim
 * wget https://github-link/index.html -O index.html
 * specify the m3u8 playlist in index.html 
 * open player : localhost/
