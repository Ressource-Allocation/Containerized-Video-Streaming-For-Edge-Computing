FROM alpine
EXPOSE 8000
RUN apk update \
&& apk add ffmpeg \
&& apk add wget \
&& apk add bc \
&& apk add curl \
&& apk add vim \
&& apk add nodejs \
&& apk add npm \
&& apk add bash \
&& npm install fluent-ffmpeg \
&& curl --output jellyfish.mp4 http://www.jell.yfish.us/media/jellyfish-10-mbps-hd-h264.mkv \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/Transcoding/create-vod-hls.sh \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/server.js \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/index.html \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/stats.html \
&& bash create-vod-hls.sh jellyfish.mp4 / \
&& mkdir /stats \
&& mkdir /dist \
&& cd /dist \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/index.css \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/random.js \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/video-js.css \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/video-js.min.css \ 
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/video.js \
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/videojs-http-streaming.js \ 
&& wget https://raw.githubusercontent.com/Ressource-Allocation/Containerized-Video-Streaming-For-Edge-Computing/master/CDN/dist/videojs-playlist.js 
CMD node server.js
