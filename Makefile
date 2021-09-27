install:
	npm ci

love:
	npm start

build:
	npm run build

rebuild:
	rm -rf dist && npm run build

lint:
	npm run lint

.PHONY: install love lint build