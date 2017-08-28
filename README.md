# @immowelt/docker-publish

[![Powered by Immowelt](https://img.shields.io/badge/powered%20by-immowelt-yellow.svg?colorB=ffb200)](https://stackshare.io/immowelt-group/)
[![Build Status](https://travis-ci.org/ImmoweltGroup/docker-publish.svg?branch=master)](https://travis-ci.org/ImmoweltGroup/docker-publish)

> A simple CLI to build and publish a repository with an Dockerfile based on GitHub repository release tags.

## Installing
```sh
npm i -D @immowelt/docker-publish
```

## Usage and examples
```
  Usage: DEBUG=@immowelt* docker-publish [options]

  Options:

    --github-api-tags-url <url>
    --versionBuildArgKey <string>
    --dockerImage <string>
```

#### Example usage
```sh
DEBUG=@immowelt* docker-publish --github-api-tags-url=https://api.github.com/repos/paulirish/pwmetrics/tags --dockerImage=immowelt/pwmetrics --versionBuildArgKey=PWMETRICS_VERSION
```

This command would build and push a docker image with the `Dockerfile` located in the processes `cwd` for each valid semver release tag that can be found under the given endpoint. Each image gets built with an `--build-arg` that matches the provided `versionBuildArgKey`, gets tagged based on the `dockerImage` option and the current iterated version tag e.g. `immowelt/pwmetrics:2.0.1`.

After the iteration of releases is done, we also re-tag the `latest` tag of docker to make sure that the `latest` tag does in fact point to the last released version.

## Contributing
Please make sure that you adhere to our code style, you can validate your changes / PR by executing `npm run lint`.
Visit the [eslint-config-immowelt-react](https://github.com/ImmoweltHH/eslint-config-immowelt-react) package for more information.

## Licensing
See the LICENSE file at the root of the repository.
