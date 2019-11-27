## HLS streaming from node
Generate your .m3u8 playlist using tools in the /Converting directory and place them in catalogue directory.
This node server will serve up the m3u8 files to an HLS compatible client (Chrome).  

## Using

```sh
node server.js
```
 * Access localhost:PORT/playlist_name.m3u8 to get the file.
 * Access localhost:PORT/list to get the list of the m3u8 playlists availble in catalogue (to be improved/ parse m3u8 extensions only).
 


When this node server will be complete it will be incuded in an docker image.
