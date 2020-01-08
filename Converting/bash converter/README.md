**What it does**

This script is used to transcode a video into a manifest of all of its possible resolutions.
In our architecture, each time a video is moved to the VOD server, it is then transcoded into all resolutions.
This is what we call static transcoding.


**running:**
```
bash create-vod-hls.sh example.mp4
```

**Produce:**
```text
    example/
      |- playlist.m3u8
      |- 360p.m3u8
      |- 360p_001.ts
      |- 360p_002.ts
      |- 480p.m3u8
      |- 480p_001.ts
      |- 480p_002.ts
      |- 720p.m3u8
      |- 720p_001.ts
      |- 720p_002.ts
      |- 1080p.m3u8
      |- 1080p_001.ts
      |- 1080p_002.ts  
```
