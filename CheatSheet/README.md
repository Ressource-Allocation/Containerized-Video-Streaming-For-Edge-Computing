**Easy Cheat Sheet for Docker**

**HOW DOES IT WORK (SIMPLIFIED)**
Or how do we unsterdand it works:
- Docker is a light virtualization != heavy virtualization in virtual machines
- With Docker you only deploy apps, without OS (just a light environment like libraries)
- The resources are allocated by the host machine, they are shared between containers
- You build a docker image aka the configuration of your containers from which you will create your containers
- To each containers will be assigned a default name if not precised in parameters and an hexa ID from which you can stop/start container
- Docker uses linux OS to work and give acces to resources to containers, if you use Docker Desktop app for Windows, it will install a linux distribution
- Once deleted, a container will loose everything (files, configuration, etc.)

**COMMANDS**
- To start Docker in cli: ```systemctl start docker   ```
- To connect to your docker hub account (necessary if you have Docker for Desktop): ```docker login```
- To search for a container on the Docker Hub: ```docker search <name to search>```
- To get a container from the Docker Hub: ```docker pull <name to pull>```
- To run a container: ```docker run [options] <name of the image from which to run the container>```
- To get access to a container's shell: docker exec -it <name of the container> /bin/bash (or any other shell)
- To copy a file from the host to a container: docker cp <local path> <name of the container>:<path on your container>
- To get help for any docker level: docker <level> --help
- to clean docker from unused images, networks, containers not running:  docker system prune

**OPTIONS**
- ```docker run -p 8080:80```   : redirect trafic from port 8080 to the container's port 80  <external>:<internal>
- ```docker run -d``` : to let your application turn in backend (and not close once its job's done)

**HOW TO CREATE YOUR OWN IMAGE**
Make a directory for your project
In this directory, write in a file called "Dockerfile" and in this file, you add commands that you need to run on the image (add packages etc.).

FROM <image>  : indicates from which image to base your own  / can only be evoked once / must be placed at first line
RUN <command> : will run your command 
EXPOSE <number>  : will open a port number
VOLUME  <path>  : to link a volume between host and container
WORKDIR <path>  :
ADD <local path> <container's path>  : to copy files/repertory from the host to the container / you can create a .dockerignore file in which you tell which files from the ADD command that you don't want to ADD
CMD <command line> : must be the last line, tells the container what command to run at start

Then you need to build your image:
```docker build -t my-app .```      => the -t option allows to name the image (the tag to be precise) and the dot tells where the Dockerfile is located

**If you want to upload your new image to your Docker repo for other people to pull**
First you need to create a link and tag your image:
docker tag <your local image's name>:<version> <your docker hub's name>/<your image's name>:<version>

Then you need to push to your repo the image:
docker push <your docker hub's name>/<your image's name>:<version>

**DOCKER-COMPOSE**
Docker-compose is used to define interactions between containers; how do my wordpress and my MySQL database will interoperate together, for example.
Docker-compose use YAML syntax in a file named docker-compose.yml:
- ```docker-compose up``` : allows you to run a stack, which is the list of containers you want to run together.
- ```docker-compose down``` : destroy all continers
- ```docker-compose stop```
- ```docker-compose config```  : to verify that the docker-compose file we made is correct syntaxically 
