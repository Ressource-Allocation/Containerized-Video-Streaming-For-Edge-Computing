#!/bin/bash
RequestNumber=5
for ((i=1;i <= $RequestNumber; i++))
do
	(google-chrome --user-data-dir="$HOME/DevSession" --disable-web-security --disable-gpu --new-window 127.0.0.1) &
done
sleep 30 
killall -9 /opt/google/chrome/chrome

