// @flow

type ExecFn = (arg: string, isLogging?: boolean) => Promise<void>;
type TagType = {
	name: string
}

const logger = require('log-fancy')('@immowelt/docker-publish');
const fetch = require('node-fetch').default;
const semver = require('semver');
const asyncExec = require('async-exec');

async function buildAndPush(opts: {dockerImage: string, versionBuildArgKey: string, version: string}) {
	const exec: ExecFn = asyncExec.default;
	const {
		dockerImage,
		versionBuildArgKey,
		version
	} = opts;
	const dockerImageTag = `${dockerImage}:${version}`;

	logger.info(`Building ${dockerImageTag}...`);

	try {
		await exec(`docker build --pull --no-cache --build-arg ${versionBuildArgKey}=${version} -t ${dockerImageTag} .`);
	} catch (e) {
		logger.warn(`Building ${dockerImageTag} failed, continuing to the next published version.`);
		return;
	}

	logger.success(`Successfuly built ${dockerImageTag}!`);

	logger.info(`Pushing ${dockerImageTag}...`);
	await exec(`docker push ${dockerImageTag}`, true);
	logger.success(`Successfuly pushed ${dockerImageTag}!`);
}

async function defaultFlow(opts: {githubApiTagsUrl: string, dockerImage: string, versionBuildArgKey: string}) {
	const {
		githubApiTagsUrl,
		dockerImage,
		versionBuildArgKey
	} = opts;

	const res = await fetch(githubApiTagsUrl);
	const tags: Array<TagType> = await res.json();
	const versionTags = tags.map(tag => semver.clean(tag.name)).filter(Boolean);

	//
	// Build and push each tag.
	//
	for (var i = 0; i < versionTags.length; i++) {
		const version = versionTags[i];

		await buildAndPush({ // eslint-disable-line no-await-in-loop
			dockerImage,
			versionBuildArgKey,
			version
		});
	}

	//
	// Renew the generic 'latest' tag of the repository to the latest version of the pwmetrics CLI.
	//
	await buildAndPush({
		dockerImage,
		versionBuildArgKey,
		version: 'latest'
	});
}

module.exports = defaultFlow;
