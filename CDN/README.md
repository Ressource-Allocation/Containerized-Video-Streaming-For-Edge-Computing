## NODE JS Server/middleware for serving HLS compatible media streams.

Generate your .m3u8 playlist using tools in the **/Converting** directory and place them in /catalogue directory on the node js server.
This node server will serve up the m3u8 files to an HLS compatible client (Chrome).  

## Using

```sh
node cdn.js
```
 * Access **localhost:PORT**  to show the home page with the list of available videos on the CDN catalogue. 
 * Access **localhost:PORT/playlist_name.m3u8** to get a video/playlist by name.
 * Access **localhost:PORT/list** to get the list of the m3u8 playlists available in catalogue in Json format.


When this node server will be complete it will be incuded in an docker image.
