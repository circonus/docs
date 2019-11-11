SRC_DIR := public/ resources/
HUGO := hugo

AWS_BUCKET := circdocs
AWS_KEY := ABCDEFG
AWS_SECRET := ABCDEFG

all: build

clean:
	@echo "purging old build"
	@rm -rf $(SRC_DIR)

build:	clean
	@$(HUGO)

upload:
	@s3deploy -key $(AWS_KEY) -secret $(AWS_SECRET) -source=$(SRC_DIR) -region=us-east-1 -bucket=$(BUCKET) -public-access=1 -force=1 -workers=128

deploy:
	build upload

server:
	-@hugo server -w --disableFastRender

