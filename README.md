# Containerized-Video-Streaming-For-Edge-Computing

**INTRODUCTION**

In this project, we will deploy a containerized CDN (Content Delivery Network) Edge node in order to study how to dynamically allocate resources (memory, CPU...) between CDPs (Content Delivery Provider), such as Netflix, Amazon Prime, etc.

As the bandwidth needs double on average every three years, deploying a content cache directly within the access netword, as close as possible to the clients becomes a relevant solution to save bandwidth within the core network and to provide a better user experience. This will benefits both the ISP (Internet Service Provider) and the CDP.

In real world, CDP already use physical servers in the access network, but as CDP multiply, it becomes easier to deploy containerized nodes on a physical server owned by the ISP, rather than having each CDP deploying their own physical server. 

This brings up a problematic for the ISP; how to allocate resources between each CDP nodes ?

To study this aspect, we will deploy a VOD (Video On Demand) node that will do ABR (Adaptive Bit Rate) streaming that will emulate a CDP node. As such, a node will represent one CPD.

**REQUIREMENTS**

We used two Ubuntu virtual machines, one serving as a edge node and one serving as a cloud node; we used virtual machines to have to different IP addresses and to be able to catch trafic between the client and the server. So you'll need to install those VMs yourself, with a distribution that fits your needs.

We recommand not to use CentOS as it can be troublesome to install ffmpeg (ffmpeg doesn't have a CentOS repository). 

**How to install the server yourself**


Because we used Ubuntu, commands may changes (we used yum as a package manager).

On each VM, you will need to install Docker (you can refer to [this](https://docs.docker.com/install/linux/docker-ce/centos/) docker installation tutorial):
```
sudo apt update
sudo apt install docker

sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
    
 sudo yum install docker-ce docker-ce-cli containerd.io
 ```
 Note that this installation doesn't need a Docker Hub account (Docker for Desktop requires one) but if you plan on using Docker Hub Registries and make your own docker images, you may want to create one.

You will need to install wget (to download a video to make our catalog) and bc (dependancy of create_vod_playlist.sh):
 ```
 sudo yum install wget 
 sudo yum install bc
 ```

Now we need ffmpeg, that we will use to create our playlist (create_vod_playlist.sh):
if you're using CentOS like us, ffmpeg has no repository at the moment, to install this you can refer to [this](https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/) guide:
```
sudo yum install epel-release
sudo rpm -v --import http://li.nux.ro/download/nux/RPM-GPG-KEY-nux.ro
sudo rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm
sudo yum install ffmpeg ffmpeg-devel
```
Or if you use any other distribution, use your standard packet manager like:
```
apt install ffmpeg
```
You then need node.js:
```
yum install nodejs
yum install npm
```

Download our scripts to your VM:
- create_vod_playlist.sh
- cdn.js
- request

If you want ot change the file path, please modify cdn.js script.
To start the node.js server, you should use:
```
node cdn.js
```

To allow incoming trafic from outside the localhost to the node.js server, we need to allow incoming trafic in iptables:
```
iptables -I INPUT -p tcp -m tcp --dport 8000 -j ACCEPT
```
Note: if you want to change the port, you need to modify the port number in 'cdn.js' and to expose the port in your docker image.

Final architecture should be like:
```
   ----/
       |___ create-vod-hls.sh
       |___ populate-catalogue.sh
       |___ cdn.js
       |___ 
       |___ ...
```

**HOW TO USE**

We will use a customed Node.js container as our VOD's node so that it is ready to go:
```
(insert our image here)
docker pull 
docker pull
```

Node.js allow us to deploy network applications that support multiple many concurrent connections. If the node isn't working, it will sleep, which saves up resources; furthermore, the node.js isn't deadlockable, and that means the process can be scalable.

**RESOURCES**

- [Node.js](https://nodejs.org/en/about/)
- [Nginx](https://www.nginx.com/)
- [VOD tutorial](https://selimatmaca.com/index.php/live-streaming?fbclid=IwAR0KnwW_2ctxplcA-JTfVU6rBrngZdmpCHoiYpAQses_os5REMfp_0Oy_0E)
