
# Client Html player

## Using


We use a local video.js player in a nginx container to display videos from a remote server.
You simply have to make sur the container is running, and then access the player using a web browser (Chrome):

* **http://localhost/** will display the player, which will start streaming automatically.

If you want a player with buttons to automate a number of requests, use the index.html file from the **Client/player_with_buttons** directory.

On your client, run the **request.sh** script to open a number of browser windows to emulate silmutaneous connections.

