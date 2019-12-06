PACKAGEPATH="/home/damu/Documents/kubernet/project/learning/DeployingPHPAPP"

all: autho startK8 prepareDeployment 

autho:
	@echo "Your password :"
	@sudo echo

startK8:
	@echo "starting K8 ... local mode\n"
	sudo minikube start --vm-driver=none --apiserver-ips 127.0.0.1 --apiserver-name localhost


prepareDeployment:
	@echo "***********************************"
	@echo "Creating the Redis Master Deployment"
	sudo kubectl apply -f $(PACKAGEPATH)/application/guestbook/redis-master-deployment.yaml
	@echo "Creating the RdisMaster Service"
	sudo kubectl apply -f $(PACKAGEPATH)/application/guestbook/redis-master-service.yaml
	@echo "Creating the Redis Slave Deployment"
	sudo  kubectl apply -f $(PACKAGEPATH)/application/guestbook/redis-slave-deployment.yaml
	@echo "Creating the Redis Slave Service"
	sudo kubectl apply -f $(PACKAGEPATH)/application/guestbook/redis-slave-service.yaml
	@echo "Creating the Guestbook Frontend Deployment"
	sudo kubectl apply -f $(PACKAGEPATH)/application/guestbook/frontend-deployment.yaml
	@echo "Creating the Frontend Service"
	sudo kubectl apply -f $(PACKAGEPATH)/application/guestbook/frontend-service.yaml
	@echo "***********************************"
	@echo "OK"
	sudo minikube service frontend --url

clean:
	sudo kubectl delete deployment -l app=redis
	sudo kubectl delete service -l app=redis
	sudo kubectl delete deployment -l app=guestbook
	sudo kubectl delete service -l app=guestbook
	sudo minikube stop
	sudo minikube delete
