FROM ubuntu
EXPOSE 8000
EXPOSE 80
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
https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Transcoding/create-vod-hls.sh \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/cdn.js \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/index.html \
&& mkdir /dist \
&& cd /dist \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/index.css \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/random.js \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/video-js.css \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/video-js.min.css \ 
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/video.js \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/videojs-http-streaming.js \ 
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/videojs-playlist.js 
CMD node /cdn.js
