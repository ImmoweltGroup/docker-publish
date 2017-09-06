// @flow

type ExecFn = (arg: string, isLogging?: boolean) => Promise<void>;
type Opts = {
  tags: Array<string>,
  image: string,
  arg: string,
  latest?: string,
  strip?: string
};
type BuildOpts = {
  image: string,
  arg: string,
  version: string,
  tag?: string
};

const logger = require('log-fancy')('@immowelt/docker-publish');
const fetch = require('node-fetch').default;
const isUrl = require('is-url');
const semver = require('semver');
const asyncExec = require('async-exec');

async function buildAndPush(opts: BuildOpts) {
  const exec: ExecFn = asyncExec.default;
  const {image, arg, version, tag = opts.version} = opts;
  const dockerImageTag = `${image}:${tag}`;

  logger.info(`Building ${dockerImageTag}...`);

  try {
    await exec(
      `docker build --pull --no-cache --build-arg ${arg}=${version} -t ${dockerImageTag} .`
    );
  } catch (e) {
    logger.warn(
      `Building ${dockerImageTag} failed with message "${e.message}", continuing to the next published version.`
    );
    logger.error(e);
    return;
  }

  logger.success(`Successfuly built ${dockerImageTag}!`);

  logger.info(`Pushing ${dockerImageTag}...`);
  await exec(`docker push ${dockerImageTag}`, true);
  logger.success(`Successfuly pushed ${dockerImageTag}!`);
}

module.exports = async (opts: Opts) => {
  const {latest = 'latest', strip = false, tags, image, arg} = opts;
  const url = tags[0];
  let versionTags = tags;

  ['image', 'tags', 'arg'].forEach(key => {
    const value = opts[key];

    if (!value) {
      throw new Error('Please specify a --tags option to the CLI.');
    }
  });

  if (typeof url === 'string' && isUrl(url)) {
    const res = await fetch(url);
    const json = await res.json();

    versionTags = json
      .map(tag => {
        const str = typeof tag === 'object' ? tag.name : tag;

        return semver.clean(str);
      })
      .filter(Boolean);
  }

  //
  // Build and push each tag.
  //
  for (var i = 0; i < versionTags.length; i++) {
    const version = versionTags[i];
    const tag = strip && strip.length ? version.replace(strip, '') : version;

    await buildAndPush({
      // eslint-disable-line no-await-in-loop
      image,
      arg,
      version,
      tag
    });
  }

  //
  // Renew the generic 'latest' tag of the repository to the latest version of the pwmetrics CLI.
  //
  await buildAndPush({
    image,
    arg,
    version: latest,
    tag: 'latest'
  });
};
