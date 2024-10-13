DOCKER_VER=220425
DOCKER_NAME=simple-message
DOCKER_HUB=10.10.21.226:82
DOCKER_GROUP=mainflux

docker:
	DOCKER_BUILDKIT=0 docker build --tag=$(DOCKER_HUB)/$(DOCKER_GROUP)/$(DOCKER_NAME):$(DOCKER_VER) -f docker/Dockerfile .

release:
	docker login -u admin -p Hbgg@DOCKER_HUB
	docker push $(DOCKER_HUB)$(DOCKER_GROUP)/$(DOCKER_NAME):$(DOCKER_VER)

.PHONY: everything docker release

everything: docker release