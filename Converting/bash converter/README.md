**What it does**

This script is used to transcode a video into a manifest of all of its possible resolutions.
In our architecture, each time a video is moved to the VOD server, it is then transcoded into all resolutions.
This is what we call static transcoding (opposite to transcoding on the fly, at the user's request).

This code, which is not ours, is open source and can be found on this [GitHub](https://gist.github.com/mrbar42/ae111731906f958b396f30906004b3fa). 

This code is used to populate the catalog directory which will contain all videos, with a sub directory for each video with all the transcoded resolutions.

This code provides resolutions up to 1920x1080. If you want higher resolution, you will have to tweak this script. We recommand you to visit [here](https://docs.peer5.com/guides/production-ready-hls-vod/) if that's the case.

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
```
   ----/
       |___ create-vod-hls.sh
       |___ populate-catalogue.sh
       |___ cdn.js
       |___ 
       |___ ...
```

  
