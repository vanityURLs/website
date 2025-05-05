CCRED=\033[0;31m
CCEND=\033[0m

.PHONY: build clean help samples config debug

help: ## Show this help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

clean:
	rm -rf public resources ## Delete outputs: public & resources

build: clean## Build site with production settings and put deliverables in ./public
	hugo -v --minify --environment prod

dev: clean ## Build site with development settings
	hugo server --watch  --disableFastRender --printI18nWarnings

open:
	open http://localhost:1313/	## Open the site in the current default browser
