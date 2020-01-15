
# Client Html player

## Using


We use a local video.js player in a nginx container to display videos from a remote server.
For now use a normal nginx image. A customized one will be created with the player.

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
Modify this index.html and replace the IPs by those of your VM servers (you might need to install your favortie text editor);
```
sources: [{
        src: 'http://localhost:8000/playlist.m3u8',
        type: 'application/x-mpegURL'
      }],
```

If you want more videos, just add another ```sources``` block with the right host and playlist name.
You can then open the player in a web browser on localhost (it will call the playlist on the server).

You will need to install all files from the dist repertory:

```
mkdir /usr/share/nginx/html/dist/
cd /usr/share/nginx/html/dist/
wget wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/chance.min.js && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/index.css && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/video-js.css && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/video-js.min.css && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/video.js && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/videojs-http-streaming.js && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/videojs-playlist.js
```

In the player_with_buttons repertory, you will find an index.html version with buttons to generate a predefined numbers of requests instead of having an autostart on streaming the playlist as the webpage is fetched.
