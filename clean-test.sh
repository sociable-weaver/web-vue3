#!/bin/bash

rm -rf cypress
rm -rf dist
rm -rf node_modules

# There is an issue with the file:line `tests/e2e/plugins/index.js:12`
npm run lint

npm install && npm run test:unit && npm run test:e2e
