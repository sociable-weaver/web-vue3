# Sociable Weaver

This is the Sociable Weaver web application repository. Changes to this repository trigger a pipeline that runs the
tests, builds the web application, and then pushes the generated static files (found in the `dist` directory) to
[another repository](https://github.com/sociable-weaver/web) which is permitted to publish those files as a
[site](https://sociable-weaver.github.io/web/#/) using GitHub Pages for deployment.

## Useful commands

- Install dependencies

  ```shell
  $ npm ci
  ```

- Lints and fixes files

  ```shell
  $ npm run lint
  ```

- Run the unit tests

  ```shell
  $ npm run test:unit
  ```

- Run the end-2-end tests

  ```shell
  $ npm run test:e2e
  ```

- Run the web application locally, ideal for development as it supports hot reload

  ```shell
  $ npm run serve
  ```

- Build the application for production

  ```shell
  $ npm run build
  ```

  The generated files are saved in the `dist` folder
