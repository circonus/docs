SRC_DIR := public/ resources/
HUGO := hugo
VERSION := v0.63.2

all: build

clean:
	@echo "purging old build"
	@rm -rf $(SRC_DIR)

version-check-$(VERSION):
	@$(HUGO) version | awk '{ if(match($$0, /v[0-9\.]+/)) { if (substr($$0, RSTART, RLENGTH) == "$(VERSION)") { exit 0; } } exit 1; }'

build:	version-check-$(VERSION) clean
	@$(HUGO)

upload:
	hugo deploy --maxDeletes 9999

deploy: build upload

server:
	-@hugo server -w --disableFastRender
