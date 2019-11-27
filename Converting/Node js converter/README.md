## NODE JS Converter 

Uses : node-fluent-ffmpeg.

## Using

```sh
node create_hls_vod.js
```
 * Will convert all videos files in the input directory to m3u8 files.

Produce:
```text
    video1/
      |- video1.m3u8
      |- video1_001.ts
      |- video1_002.ts
    video2/
      |- video2.m3u8
      |- video2_001.ts
      |- video2_002.ts
```
