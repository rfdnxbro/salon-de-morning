.PHONY: build test lint fmt dev help dev-user dev-store dev-client dev-admin preview-user preview-store preview-client preview-admin

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
	@echo "利用可能: dev-user, dev-store, dev-client, dev-admin"

dev-user:
	@pnpm dev:user

dev-store:
	@pnpm dev:store

dev-client:
	@pnpm dev:client

dev-admin:
	@pnpm dev:admin

preview-user:
	@pnpm preview:user

preview-store:
	@pnpm preview:store

preview-client:
	@pnpm preview:client

preview-admin:
	@pnpm preview:admin
