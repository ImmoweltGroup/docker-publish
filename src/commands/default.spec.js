const sinon = require('sinon');
const nock = require('nock');
const asnycExec = require('async-exec');
const defaultFlow = require('./default.js');

describe('defaultFlow()', () => {
	let exec;

	beforeEach(() => {
		exec = sinon.stub(asnycExec, 'default').returns(Promise.resolve());
		nock('http://localhost/')
			.get('/foo/bar/tags')
			.reply(200, [{
				name: 'foo'
			}, {
				name: 'v2.0.1'
			}]);
	});

	afterEach(() => {
		exec.restore();
	});

	it('should be a function.', () => {
		expect(typeof defaultFlow).toBe('function');
	});

	it('should query the given tags URL and build and push the docker image for each of the filtered release tags.', async () => {
		await defaultFlow({
			githubApiTagsUrl: 'http://localhost/foo/bar/tags',
			dockerImage: 'foo/bar',
			versionBuildArgKey: 'BAR_VERSION'
		});

		expect(exec.callCount).toBe(4);
		expect(exec.args[0][0]).toContain('docker build');
		expect(exec.args[0][0]).toContain('-t foo/bar:2.0.1');
		expect(exec.args[0][0]).toContain('--build-arg BAR_VERSION=2.0.1');

		expect(exec.args[1][0]).toContain('docker push');
		expect(exec.args[1][0]).toContain('foo/bar:2.0.1');

		expect(exec.args[2][0]).toContain('docker build');
		expect(exec.args[2][0]).toContain('-t foo/bar:latest');
		expect(exec.args[2][0]).toContain('--build-arg BAR_VERSION=latest');

		expect(exec.args[3][0]).toContain('docker push');
		expect(exec.args[3][0]).toContain('foo/bar:latest');
	});
});
