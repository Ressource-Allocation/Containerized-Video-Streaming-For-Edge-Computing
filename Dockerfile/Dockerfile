FROM ubuntu
expose 8000
RUN apt-get update -yq \
&& apt-get install ffmpeg -yq \
&& apt-get install nodejs -yq \
&& apt-get install npm -yq \
&& apt-get install wget -yq \
&& apt-get install bc -yq \
&& apt-get install curl -yq \
&& curl -sL https://deb.nodesource.com/setup_13.x | bash - \
&& apt-get install -y nodejs \
&& npm install fluent-ffmpeg \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Converting/bash%20converter/create-vod-hls.sh \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/cdn.js \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/index.html \
CMD node /cdn.js
