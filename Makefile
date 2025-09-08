.PHONY: build test lint fmt dev help dev-user dev-store dev-client preview-user preview-store preview-client

help:
	@echo "Targets: build test lint fmt dev"

build:
	@pnpm build

test:
	@pnpm test

lint:
	@pnpm lint

fmt:
	@pnpm fmt

dev:
	@echo "利用可能: dev-user, dev-store, dev-client"

dev-user:
	@pnpm dev:user

dev-store:
	@pnpm dev:store

dev-client:
	@pnpm dev:client

preview-user:
	@pnpm preview:user

preview-store:
	@pnpm preview:store

preview-client:
	@pnpm preview:client
