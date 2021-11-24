# Sociable Weaver

This is the Sociable Weaver web application repository. Changes to this repository triggers a pipeline that runs the
tests, builds the web application and then publishes the generated static files (found in the `dist` folder) it to
another repository, the [sociable-weaver-web](https://github.com/albertattard/sociable-weaver-web) repository. The
_sociable-weaver-web_ repository published its contents as a GitHub webpage, taking advantage from the free static page
hosting, available [here](https://albertattard.github.io/sociable-weaver-web/).

Publishing the generated static files (found in the `dist` folder) as GitHub pages within this repository was not
possible, thus the second repository (_sociable-weaver-web_) had to be created.

## Useful commands

- Install dependencies

  ```shell
  $ npm install
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
