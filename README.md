# @immowelt/docker-publish

[![Powered by Immowelt](https://img.shields.io/badge/powered%20by-immowelt-yellow.svg?colorB=ffb200)](https://stackshare.io/immowelt-group/)
[![Build Status](https://travis-ci.org/ImmoweltGroup/docker-publish.svg?branch=master)](https://travis-ci.org/ImmoweltGroup/docker-publish)
[![Dependency Status](https://david-dm.org/ImmoweltGroup/docker-publish.svg)](https://david-dm.org/ImmoweltGroup/docker-publish)
[![devDependency Status](https://david-dm.org/ImmoweltGroup/docker-publish/dev-status.svg)](https://david-dm.org/ImmoweltGroup/docker-publish#info=devDependencies&view=table)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> A simple CLI to build and publish a repository with an Dockerfile based on semver versions or GitHub repository release tags.

## Installing
```sh
npm i -D @immowelt/docker-publish
```

## Usage and examples
```
  Usage: docker-publish [options]

  Options:

    --tags   <List<string> | url> The Github tags API URL or the raw list of tags to iterate over.
    --arg    <string>             The build-arg key to use when forwarding the current iterated tag.
    --image  <string>             The image name for the docker images to create.
    --latest <string>             An optional 'latest' tag to specify, defaults to 'latest'
    --strip  <string>             An optional string which will be removed from the docker tags to generate. E.g. useful if your repo is named 'foo/java-alpine' and you don't want to repeat the '-alpine' keyword in tags.
```

#### Example usage
```sh
docker-publish --tags=8.2.0-alpine,8.4.0-alpine --image=immowelt/node --arg=NODE_VERSION --latest
```

This command would build and push a docker image with the `Dockerfile` located in the processes `cwd` for each valid semver release tag of the official NodeJS repository. During the build we forward an `--build-arg`, e.g. `NODE_VERSION` with the current iterated version. After the build is done the image gets tagged e.g. `immowelt/node:8.3.0`.

After the iteration of releases is done, we also re-tag the `latest` tag of docker to make sure that the `latest` tag does in fact point to the last released version.

## Contributing
See the `CONTRIBUTING.md` file at the root of the repository.

## Licensing
See the `LICENSE` file at the root of the repository.
