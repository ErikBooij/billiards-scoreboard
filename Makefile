.PHONY: run-dev
run-dev:
	./node_modules/.bin/next

.PHONY: build
build:
	bun run build