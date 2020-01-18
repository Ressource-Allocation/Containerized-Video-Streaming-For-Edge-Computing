## NODE JS Server/middleware for serving HLS compatible media streams.

Generate your .m3u8 playlist using tools in the **/Converting** directory and place them in **/** directory on the node js server.
This node server will serve up the m3u8 files to an HLS compatible client (Chrome).

Run the following command after uploading to your server container the cdn.js script:

```
node cdn.js
```
If you acces via your browser:
 * **http://<server's ip>:PORT**  to show the home page with the list of available videos on the CDN catalogue. 
 * **http://<server's ip>/playlist_name.m3u8** to get a video/playlist by name.
 * **http://<server's ip>/list** to get the list of the m3u8 playlists available in catalogue in Json format.
 * **http://<server's ip>/raw_data** to get the raw data used to generate the stats chart.
 * **http://<server's ip>/stats** to get the stats chart.


When this node server will be complete it will be incuded in an docker image.
