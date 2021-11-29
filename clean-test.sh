#!/bin/bash

rm -rf cypress
rm -rf dist

npm ci && npm run lint && npm run test:unit && npm run test:e2e
