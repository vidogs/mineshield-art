VERSION := 1.0.0
IMAGE := vidog/mineshield-art-frontend

GIT_TAG         := $(shell git describe --tags --dirty --always 2>/dev/null || echo "dev")
GIT_BRANCH      := $(shell git rev-parse --abbrev-ref HEAD)
GIT_COMMIT      := $(shell git rev-parse HEAD)
GIT_COMMIT_SHORT:= $(shell git rev-parse --short HEAD)

.PHONY: docker_build
docker_build:
	docker buildx build \
		--platform linux/amd64 \
		--build-arg GIT_TAG=$(GIT_TAG) \
		--build-arg GIT_BRANCH=$(GIT_BRANCH) \
		--build-arg GIT_COMMIT=$(GIT_COMMIT) \
		--build-arg GIT_COMMIT_SHORT=$(GIT_COMMIT_SHORT) \
		-f ./build/Dockerfile \
		-t $(IMAGE):$(VERSION) \
		--load .

.PHONY: docker_publish
docker_publish:
	docker push $(IMAGE):$(VERSION)

.PHONY: docker_publish_latest
docker_publish_latest:
	docker tag $(IMAGE):$(VERSION) $(IMAGE):latest
	docker push $(IMAGE):latest

.PHONY: publish
publish: docker_build docker_publish docker_publish_latest
