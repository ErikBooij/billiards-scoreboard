.PHONY: run-dev
run-dev:
	./node_modules/.bin/next

.PHONY: run-prod
run-prod: build
	./node_modules/.bin/next start

.PHONY: build
build:
	bun run build