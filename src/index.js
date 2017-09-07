#!/usr/bin/env node

const logger = require('log-fancy')('@immowelt/docker-publish');
const cli = require('commander');
const defaultFlow = require('./commands/default.js');
const pkg = require('./../package.json');

cli
  .option(
    '--tags <url | Array<string>>',
    'The JSON array to parse or the GitHub API URL which points to a repositories tags.',
    val => val.split(',')
  )
  .option('--image <string>', 'The docker image name to use as a base.')
  .option('--arg <string>', 'The build-arg key which will be used to.')
  .option(
    '--latest <string>',
    'The tag/version to pass into the docker build when building your latest image, defaults to "latest".'
  )
  .option(
    '--strip <string>',
    'An optional string to strip from the generated/fetched docker tags.'
  )
  .description(
    'Uses/Fetches the given tags, filters out release only tags based on semver and builds/pushes the docker images.'
  )
  .version(pkg.version)
  .parse(process.argv);

if (!cli.rawArgs.length) {
  cli.help();
  process.exit(0);
}

(async function() {
  const {tags, image, arg, latest, strip} = cli;

  try {
    await defaultFlow({
      latest,
      tags,
      image,
      strip,
      arg
    });
  } catch (err) {
    logger.error(`Something went wrong while building and pushing the images:`);
    logger.fatal(err.message || err);
  }
})();
