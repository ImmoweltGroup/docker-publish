# @immowelt/docker-publish

[![Powered by Immowelt](https://img.shields.io/badge/powered%20by-immowelt-yellow.svg?colorB=ffb200)](https://stackshare.io/immowelt-group/)
[![Greenkeeper badge](https://badges.greenkeeper.io/ImmoweltGroup/docker-publish.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/ImmoweltGroup/docker-publish.svg?branch=master)](https://travis-ci.org/ImmoweltGroup/docker-publish)
[![Dependency Status](https://david-dm.org/ImmoweltGroup/docker-publish.svg)](https://david-dm.org/ImmoweltGroup/docker-publish)
[![devDependency Status](https://david-dm.org/ImmoweltGroup/docker-publish/dev-status.svg)](https://david-dm.org/ImmoweltGroup/docker-publish#info=devDependencies&view=table)

> A simple CLI to build and publish a repository with an Dockerfile based on semver versions or GitHub repository release tags.

## Installing
```sh
npm i -D @immowelt/docker-publish
```

## Usage and examples
```
  Usage: DEBUG=@immowelt* docker-publish [options]

  Options:

    --tags <url>
    --arg <string>
    --image <string>
```

#### Example usage
```sh
docker-publish --tags=8.2.0-alpine,8.4.0-alpine --image=immowelt/node --arg=NODE_VERSION
```

This command would build and push a docker image with the `Dockerfile` located in the processes `cwd` for each valid semver release tag of the official NodeJS repository. During the build we forward an `--build-arg`, e.g. `NODE_VERSION` with the current iterated version. After the build is done the image gets tagged e.g. `immowelt/node:8.3.0`.

After the iteration of releases is done, we also re-tag the `latest` tag of docker to make sure that the `latest` tag does in fact point to the last released version.

## Contributing
Please make sure that you adhere to our code style, you can validate your changes / PR by executing `npm run lint`.
Visit the [eslint-config-immowelt-react](https://github.com/ImmoweltHH/eslint-config-immowelt-react) package for more information.

## Licensing
See the LICENSE file at the root of the repository.
