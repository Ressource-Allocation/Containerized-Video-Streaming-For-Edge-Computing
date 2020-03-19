# Containerized-Video-Streaming-For-Edge-Computing
This project has been made under Creative Commons licence CC-BY.
For more information about this licence, please read [this](https://creativecommons.org/licenses/by/4.0/).

Our Docker Hub [here](https://hub.docker.com/repository/docker/containerizededge/server-vod-hls).
If you want to know more information, check the document project-description.pdf in this repository.

**INTRODUCTION**

In this project, we will deploy a containerized CDN (Content Delivery Network) Edge node in order to study how to dynamically allocate resources (memory, CPU...) between CDPs (Content Delivery Provider), such as Netflix, Amazon Prime, etc.

As the bandwidth needs double on average every three years, deploying a content cache directly within the access network, as close as possible to the clients becomes a relevant solution to save bandwidth within the core network and to provide a better user experience (faster site loading time, reduced latency). This will benefits both the ISP (Internet Service Provider) and the CDP.

In real world, CDP already use physical servers distributed around the world, but as new technologies emerge, it becomes relevant to implement these servers in the Access Network (in the Central Office of Network Operators); this means to possibly deploy millions of CDN caches. One way to do it is through containerization.

This brings up a problematic for the Network Operator; how to allocate resources between each containerized CDP node ?

To study this aspect, we will deploy a **VOD (Video On Demand)** server that will do **ABR (Adaptive Bit Rate)** streaming through **HLS (HTTP Live Streaming)** as a CDN.

---
**REQUIREMENTS**

We used two Ubuntu virtual machines, one serving as a edge node and one serving as a cloud node; we used virtual machines to have to different IP addresses and to be able to catch trafic between the client and the server. So you'll need to install those VMs yourself, with a distribution that fits your needs.

We recommand not using CentOS as it can be troublesome to install ffmpeg (ffmpeg doesn't have a CentOS repository).

---
**How to use the project**

Open the port 8000 on both VM hosting the servers:
```
ufw allow 8000/tcp
```
You'll need to install wondershaper on your VM hosting the Cloud server to limit the bandwidth;
```
apt-get install wondershaper
wondershaper <interface name> <upload speed> <download speed>
```

Once Docker is installed on your VMs hosting the servers and client, pull our images and run it.
To pull the server image (hosting the videos and statistics):
```
docker run -d -p 8000:8000 organizededge/server-vod-hls
```


In the file `service.json` modify the following lines with the correct ip addresses:
```
     sources: [{
        src: 'http://<Cloud ip address>:8000/playlist.m3u8',
        type: 'application/x-mpegURL'
      }],
      poster: 'http://www.videojs.com/img/poster.jpg'
    }, {
      sources: [{
        src: 'http://<Cloud ip address>:8000/playlist.m3u8',
        type: 'application/x-mpegURL'
      }],
      poster: 'http://www.videojs.com/img/poster.jpg'
    }]
```


On the client, if you launch the **request.sh** script, it will launch multiple Chrome browser windows that will start streaming:
```
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/request.sh
./request.sh
```

You can access the quality distribution graphs of the segments sent by the server on a browser:
```
http://<your server ip address:8000/stats
```
If you want to see the graph of the segments received by the Client, merge the stats of the two servers. To do so, connect to one server:
```
wget http://<ip of the other server>:8000/raw_stats
cat raw_stats >> /stats/generated_stats.txt
```
Then refresh the graph of this server (it will replace the file though).


---
**Installation of the servers step by step**

Here are the steps:
- Installing the VMs,
- Installings Docker on the VMs,
- Pulling an Ubuntu image and use it to run a container,
- Installing all necessary tools and packages,
- Pulling our scripts on the container,
- Launching the node.js server (using the cdn.js).

Now you only need to automate the requests and analyze them.

Because we used Ubuntu, commands may changes (we used apt as a package manager). As both servers have the same configuration, you need to do it on both machines. We recommand using a tool with a multi-execution split screen mode, like [MobaXterm](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=2ahUKEwiykv6Sh4HnAhVFxIUKHV3aBtAQFjAAegQICBAC&url=https%3A%2F%2Fmobaxterm.mobatek.net%2F&usg=AOvVaw2p74aXHoSZjuU9aYznA2Af) or equivalent (to allow you to execute a command on two screens directly).

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
Note that this installation doesn't need a Docker Hub account (Docker for Desktop requires one) but if you plan on using Docker Hub registries and making your own docker images, you may want to create one.

We will pull an ubuntu docker image:
```
sudo docker pull ubuntu
```
Then we will run this image in a container on which we will install packages and a video (even though best practices would be to use a Dockerfile \[we did this after\]:
```
sudo docker run -dit -p 8000:8000 --name server-hls ubuntu
sudo docker exec -dit server-hls
```


Now we need ffmpeg, that we will use to create our playlist (create_vod_playlist.sh):
```
apt-get install ffmpeg
```
Install these tools:
```
apt-get install wget
apt-get install bc
apt-get install curl
curl --output jellyfish.mp4 http://www.jell.yfish.us/media/jellyfish-10-mbps-hd-h264.mkv
```
Our video, ```jellyfish.mp4``` can be found [here](http://www.jell.yfish.us/) under different resolutions.

You then need node.js:
```
curl -sL https://deb.nodesource.com/setup_13.x | bash -
apt-get install -y nodejs
npm install fluent-ffmpeg
```

Download the Videos.js and its dependencies, and also our scripts to your containers:
```
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Converting/bash%20converter/create-vod-hls.sh
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/cdn.js
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/index.html
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/stats.html
mkdir /dist
cd /dist
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/index.css 
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/random.js 
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/video-js.css 
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/video-js.min.css 
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/video.js 
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/videojs-http-streaming.js 
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/videojs-playlist.js 
```
What do these scripts do ?
- create-vod-hls.sh : creates a m3u8 playlist of multiple resolutions from a source video, 
- cdn.js : our node.js app, i.e. it creates the HLS server, which uses the index.html for presentation and as a Video.js player.


You need to modify the index.html page of the video service. In order to do so, do on your bash:
```
docker container exec -it server-hls /bin/bash
```

Inside this bash, open (with nano, for example) the file `index.html` and modify the following part with the correct addresses
```
     sources: [{
        src: 'http://<Cloud ip address>:8000/playlist.m3u8',
        type: 'application/x-mpegURL'
      }],
      poster: 'http://www.videojs.com/img/poster.jpg'
    }, {
      sources: [{
        src: 'http://<Cloud ip address>:8000/playlist.m3u8',
        type: 'application/x-mpegURL'
      }],
      poster: 'http://www.videojs.com/img/poster.jpg'
    }]
```

To start the node.js server inside the container, you should use:
```
node server.js
```

Make sure your VM ports are open to allow incoming trafic:
```
ufw allow 8000/tcp
```

Final architecture should be like:
```
   ----/
       |___ create-vod-hls.sh
       |___ cdn.js
       |___ stats/
       |         |__stats.txt
       |___ yourvideos
       |___ dist/
       |        |___ index.css
       |        |___ random.js
       |        |___ video-js.css
       |        |___ video-js.min.css
       |        |___ video.js
       |        |___ videojs-http-streaming.js
       |        |___ videojs-playlist.js
       |___ ...
```
The stats directory will hold the streaming statistics that we will analyze.

----
***Watch videos on a client***

Use Google Chrome (other browsers may not work)

CHENGLONG

**SET UP TESTBED CONFIGURATION**

---
***Limit bandwidth***
You'll need to install wondershaper on your VM hosting the Cloud to limit the bandwidth;
```
apt-get install wondershaper
wondershaper <interface name> <upload speed> <download speed>
```
We limit the outgoing speed of the VM hosting the Cloud server to emulate a limited bandwitdth between the Edge and Cloud nodes. 



---
***How to automate requests***

On your client host from which you want to generate requests, you will need Chrome web browser. 
Pull the request.sh from our git then execute it:
```
wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Client/request.sh
./request.sh
```
This script will open several chrome windows, which will start streaming from the servers using a Zipf law of distribution between the Edge and Cloud servers (so the probability of streaming from the Edge server is greater than streaming from the Cloud server). Since we used an Ubuntu distribution on the machine host, this script is in bash.

At first run, you will be prompted to make Chrome your favorite web browser: click 'yes' (it will only Chrome the favorite browser of the Dev Session and will not erase the actual user favorite web browser).

--- 

**RESOURCES**
All resources used in our project are their author propriety:
- [Prob.js](https://github.com/bramp/prob.js/blob/master/prob.js)
- [Node.js](https://nodejs.org/en/about/)
- [VOD tutorial](https://selimatmaca.com/index.php/live-streaming?fbclid=IwAR0KnwW_2ctxplcA-JTfVU6rBrngZdmpCHoiYpAQses_os5REMfp_0Oy_0E)
- [Jellyfish.mp4](http://www.jell.yfish.us/)
- [create-vod-hls.sh](https://gist.github.com/mrbar42/ae111731906f958b396f30906004b3fa)
- [Transcoding using FFMPEG](http://docs.peer5.com/guides/production-ready-hls-vod/)
- [Docker Official Website](https://www.docker.com/)
- [Chrome](https://www.google.com/intl/fr_fr/chrome/)
- [Video.js](https://videojs.com/getting-started)

