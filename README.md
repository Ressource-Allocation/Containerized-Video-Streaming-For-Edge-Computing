# Containerized-Video-Streaming-For-Edge-Computing

Brace yourself, this may take a while to read.

**INTRODUCTION**

In this project, we will deploy a containerized CDN (Content Delivery Network) Edge node in order to study how to dynamically allocate resources (memory, CPU...) between CDPs (Content Delivery Provider), such as Netflix, Amazon Prime, etc.

As the bandwidth needs double on average every three years, deploying a content cache directly within the access netword, as close as possible to the clients becomes a relevant solution to save bandwidth within the core network and to provide a better user experience. This will benefits both the ISP (Internet Service Provider) and the CDP.

In real world, CDP already use physical servers in the access network, but as CDP multiply, it becomes easier to deploy containerized nodes on a physical server owned by the ISP, rather than having each CDP deploying their own physical server. 

This brings up a problematic for the ISP; how to allocate resources between each CDP nodes ?

To study this aspect, we will deploy a VOD (Video On Demand) node that will do ABR (Adaptive Bit Rate) streaming that will emulate a CDP node. As such, a node will represent one CPD.

---
**REQUIREMENTS**

We used two Ubuntu virtual machines, one serving as a edge node and one serving as a cloud node; we used virtual machines to have to different IP addresses and to be able to catch trafic between the client and the server. So you'll need to install those VMs yourself, with a distribution that fits your needs.

We recommand not to use CentOS as it can be troublesome to install ffmpeg (ffmpeg doesn't have a CentOS repository).

---
**How to use the docker image**

Once Docker is installed, pull our images and run it.
To pull the image:
```
docker pull 
```
---
**Installation of the servers step by step**

Here are the steps:
- Installing the VMs,
- Installings Docker on the VMs,
- Pulling an Ubuntu image and use it to run a container,
- Installing all necessary tools and packages,
- Pulling our scripts on the container,
- Populating the containers with a catalogue using the populate-catalogue.sh (which use the create-vod-hls.sh),
- Launching the node.js server (using the cdn.js).

Now you only need to automate the requests and analyze them.

Because we used Ubuntu, commands may changes (we used yum as a package manager). As both servers have the same configuration, you need to do it on both machines. We recommand using a tool with a multi-execution split screen mode, like [MobaXterm](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=2ahUKEwiykv6Sh4HnAhVFxIUKHV3aBtAQFjAAegQICBAC&url=https%3A%2F%2Fmobaxterm.mobatek.net%2F&usg=AOvVaw2p74aXHoSZjuU9aYznA2Af) or equivalent (to allow you to execute a command on two screens directly).

On each VM, you will need to install Docker (you can refer to [this](https://docs.docker.com/install/linux/docker-ce/ubuntu/) docker installation tutorial):
```
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
 curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
 sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
    
 sudo apt-get install docker-ce docker-ce-cli containerd.io
 ```
Note that this installation doesn't need a Docker Hub account (Docker for Desktop requires one) but if you plan on using Docker Hub Registries and make your own docker images, you may want to create one.

We will pull an ubuntu docker image:
```
sudo docker pull ubuntu
```
Then we will run this image in a container on which we will install packages and a video (even though best practices would be to use a Dockerfile \[we did this after\]:
```
sudo docker run -dit -p 8000:8000 --name server-hls ubuntu
sudo docker cp jellyfish.mp4 server-hls:/
sudo docker exec -dit server-hls
```
Our video, ```jellyfish.mp4``` can be found [here](http://www.jell.yfish.us/).

Now we need ffmpeg, that we will use to create our playlist (create_vod_playlist.sh):
```
apt-get install ffmpeg
```
Install these tools:
```
apt-get install ffmpeg
apt-get install wget
apt-get install bc
apt-get install curl
```

You then need node.js:
```
curl -sL https://deb.nodesource.com/setup_13.x | bash -
apt-get install -y nodejs
npm install fluent-ffmpeg
```

Download our scripts to your containers:
```
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Converting/bash%20converter/create-vod-hls.sh
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/cdn.js
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/index.html
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/stats.html
```
What does these scripts do ?
- create-vod-hls.sh : creates a m3u8 playlist of multiple resolutions from a source video, 
- cdn.js : our node.js app, i.e. it creates the HLS server, which use the index.html for presentation.


To start the node.js server, you should use:
```
node cdn.js
```

Make sure your VM ports are open to allow incoming trafic:
```
ufw allow 8000/tcp
```

Final architecture should be like:
```
   ----/
       |___ create-vod-hls.sh
       |___ populate-catalogue.sh
       |___ cdn.js
       |___ stats/
       |         |__stats.txt
       |___ yourvideos
       |___ ...
```
The stats directory will hold the streaming statistics that we will analyze.

---

**How to install step by step the streaming client**

We will install here a server nginx to have a videojs player to play our playlist. This server will be on localhost and inside the index.html, it will fetch the videos on the HLS servers (either the edge or cloud node).

Pull an nginx image and run it:
```
sudo docker run -d -p 80:80 --name nginx nginx
sudo docker exec -it nginx /bin/bash
```
Install on it wget to pull the index.html and the videojs player from our GutHub:
```
apt-get update
apt-get install wget
cd /usr/share/nginx/html/
rm index.html
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/player_with_button/index.html
mkdir dist
cd dist
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/chance.min.js && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/index.css && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/video-js.css && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/video-js.min.css && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/video.js && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/videojs-http-streaming.js && wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/dist/videojs-playlist.js


```
On your client host, you will need Chrome as a your favorite web browser (important). 
Pull the request.sh from our git then execute it:
```
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/request.sh
./request.sh
```
This script will open several chrome windows which will start streaming from the servers using a Zipf law of distribution between the Edge and Cloud servers (so the probability of streaming from the Edge server is greater than streaming from the Cloud server). Since we used an Ubuntu distribution on the machine host, this script is a bash

--- 

**RESOURCES**

- [Node.js](https://nodejs.org/en/about/)
- [Nginx](https://www.nginx.com/)
- [VOD tutorial](https://selimatmaca.com/index.php/live-streaming?fbclid=IwAR0KnwW_2ctxplcA-JTfVU6rBrngZdmpCHoiYpAQses_os5REMfp_0Oy_0E)
- [Jellyfish.mp4](http://www.jell.yfish.us/)
- [create-vod-hls.sh](https://gist.github.com/mrbar42/ae111731906f958b396f30906004b3fa)
- [Transcoding using FFMPEG](http://docs.peer5.com/guides/production-ready-hls-vod/)
- [Docker Official Website](https://www.docker.com/)
- [Chrome](https://www.google.com/intl/fr_fr/chrome/)

