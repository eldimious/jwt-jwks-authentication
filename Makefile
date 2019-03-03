BIN = ./node_modules/.bin
TESTS = test/*.test.js
MOCHA_OPTS = --recursive --timeout 15000

test: lint
	@echo "Testing..."
	@NODE_ENV=test $(BIN)/nyc $(BIN)/_mocha $(MOCHA_OPTS) $(TESTS)
test-cov: lint
	@echo "Testing..."
	@NODE_ENV=test $(BIN)/nyc report --reporter=text-lcov $(BIN)/_mocha -- $(MOCHA_OPTS) $(TESTS)
test-coveralls: test-cov
	@cat ./coverage/lcov.info | $(BIN)/coveralls --verbose
.PHONY: lint test test-cov test-coveralls