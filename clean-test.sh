#!/bin/bash

set -e

rm -rf node_modules
npm install
npm run lint
npm run test:unit
npm run test:e2e
