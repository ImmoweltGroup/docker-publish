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
			tags: ['http://localhost/foo/bar/tags'],
			image: 'foo/bar',
			arg: 'BAR_VERSION'
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

	it('should allow the usage of raw version tags.', async () => {
		await defaultFlow({
			tags: ['2.2.1', '3.0.0'],
			image: 'foo/bar',
			arg: 'BAR_VERSION'
		});

		expect(exec.callCount).toBe(6);
		expect(exec.args[0][0]).toContain('docker build');
		expect(exec.args[0][0]).toContain('-t foo/bar:2.2.1');
		expect(exec.args[0][0]).toContain('--build-arg BAR_VERSION=2.2.1');

		expect(exec.args[1][0]).toContain('docker push');
		expect(exec.args[1][0]).toContain('foo/bar:2.2.1');

		expect(exec.args[2][0]).toContain('docker build');
		expect(exec.args[2][0]).toContain('-t foo/bar:3.0.0');
		expect(exec.args[2][0]).toContain('--build-arg BAR_VERSION=3.0.0');

		expect(exec.args[3][0]).toContain('docker push');
		expect(exec.args[3][0]).toContain('foo/bar:3.0.0');

		expect(exec.args[4][0]).toContain('docker build');
		expect(exec.args[4][0]).toContain('-t foo/bar:latest');
		expect(exec.args[4][0]).toContain('--build-arg BAR_VERSION=latest');

		expect(exec.args[5][0]).toContain('docker push');
		expect(exec.args[5][0]).toContain('foo/bar:latest');
	});

	it('should allow the usage a custom latest tag.', async () => {
		await defaultFlow({
			tags: [],
			image: 'foo/bar',
			arg: 'BAR_VERSION',
			latest: '5.0.1'
		});

		expect(exec.callCount).toBe(2);
		expect(exec.args[0][0]).toContain('docker build');
		expect(exec.args[0][0]).toContain('-t foo/bar:latest');
		expect(exec.args[0][0]).toContain('--build-arg BAR_VERSION=5.0.1');

		expect(exec.args[1][0]).toContain('docker push');
		expect(exec.args[1][0]).toContain('foo/bar:latest');
	});
});
