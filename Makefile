SRC_DIR := public/ resources/
HUGO := hugo

all: build

clean:
	@echo "purging old build"
	@rm -rf $(SRC_DIR)

build:	clean
	@$(HUGO)

upload:
	hugo deploy --maxDeletes 9999

deploy: build upload

server:
	-@hugo server -w --disableFastRender --port 80
