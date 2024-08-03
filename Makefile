CCRED=\033[0;31m
CCEND=\033[0m

.PHONY: build clean help samples config debug

help: ## Show this help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

debug: ## Show the site configuration (e.g., hugo)

	@hugo config

clean:
	rm -rf public resources ## Delete outputs: public & resources

build: clean## Build site with production settings and put deliverables in ./public
	hugo --verbose --minify --environment prod
	rm public/index.html

dev: clean serve ## Build site with development settings

open:
	open http://localhost:8080/	## Open the site in the current default browser

assets: ## Copy assets to /static folder
	@cp ~/Documents/W.\ Brand/Assets/android-chrome* static
	@cp ~/Documents/W.\ Brand/Assets/apple-touch-icon* static
	@cp ~/Documents/W.\ Brand/Assets/favicon* static
	@cp ~/Documents/W.\ Brand/Assets/site.webmanifest static
	@cp ~/Documents/W.\ Brand/Assets/Dicaire\ Logo\ Reverse\ 800.png static/logo.png

map: ## Copy mindmaps to /static folder
	@echo "Copy mindmaps"
	@mkdir -p static/references
	@cp _mindmaps/references.html static/references/index.html
	@mkdir -p static/exigences
	@cp _mindmaps/exigences.html static/exigences/index.html
	@mkdir -p static/loi25
	@cp _mindmaps/loi25.html static/loi25/index.html
	@mkdir -p static/pbd
	@cp _mindmaps/privacyByDesign.html static/pbd/index.html
	@mkdir -p static/iso27k
	@cp _mindmaps/iso27k.html static/iso27k/index.html
	@mkdir -p static/pbdstrategies
	@cp _mindmaps/PbDStrategies.html static/pbdstrategies/index.html
	@mkdir -p static/cryptoAgility
	@cp _mindmaps/cryptoAgility.html static/cryptoAgility/index.html
	@mkdir -p static/cloudModel
	@cp _mindmaps/cloudModel.html static/cloudModel/index.html
	@mkdir -p static/securityDefinitions
	@cp _mindmaps/securityDefinitions.html static/securityDefinitions/index.html
	@mkdir -p static/vigie
	@cp _mindmaps/vigie.html static/vigie/index.html
	@mkdir -p static/azure
	@cp _mindmaps/azureLandscape.html static/azure/index.html
	@mkdir -p static/securityTrends
	@cp _mindmaps/securityTrends.html static/securityTrends/index.html
	@mkdir -p static/adPenTest
	@cp _mindmaps/adPenTest.html static/adPenTest/index.html
	@mkdir -p static/controlesPME
	@cp _mindmaps/controlesPME.html static/controlesPME/index.html

config: ## Create config files in /assets/
	@hugo env > ./assets/config.prod.txt
	@echo  >> ./assets/config.prod.txt
	@hugo -e production config >> ./assets/config.prod.txt
	@echo  >> ./assets/config.prod.txt
	@hugo config mounts >> ./assets/config.prod.txt
	@hugo env >  ./assets/config.dev.txt
	@echo  >>  ./assets/config.dev.txt
	@hugo -e development config >>  ./assets/config.dev.txt
	@echo  >> ./assets/config.dev.txt
	@hugo config mounts >> ./assets/config.dev.txt
	@echo "Create a list of draft pages"
	@hugo list drafts > ./assets/draftItems.txt

serve:
	hugo server --watch --verbose --disableFastRender --printI18nWarnings

status:
	@git submodule status --recursive | awk '/^[+-]/ {printf "\033[31mWARNING\033[0m Submodule not initialized: \033[34m%s\033[0m\n",$$2}' 1>&2
	@git status

check-links: link-checker-setup run-link-checker ## Check links

link-checker-setup:
	curl https://htmltest.wjdp.uk | bash

run-link-checker:
	@echo "$(CCRED)**** The use of link-checked is deprecated. Use container-image instead. ****$(CCEND)"
	bin/htmltest
