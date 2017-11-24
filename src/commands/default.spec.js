const nock = require('nock');
const asnycExec = require('async-exec');
const defaultFlow = require('./default.js');

describe('defaultFlow()', () => {
  let exec;

  beforeEach(() => {
    exec = jest
      .spyOn(asnycExec, 'default')
      .mockImplementation(jest.fn(() => Promise.resolve()));
    nock('http://localhost/')
      .get('/foo/bar/tags')
      .reply(200, [
        {
          name: 'foo'
        },
        {
          name: 'v2.0.1'
        }
      ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
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

    expect(exec).toHaveBeenCalledTimes(4);
    expect(exec.mock.calls[0][0]).toContain('docker build');
    expect(exec.mock.calls[0][0]).toContain('-t foo/bar:2.0.1');
    expect(exec.mock.calls[0][0]).toContain('--build-arg BAR_VERSION=2.0.1');

    expect(exec.mock.calls[1][0]).toContain('docker push');
    expect(exec.mock.calls[1][0]).toContain('foo/bar:2.0.1');

    expect(exec.mock.calls[2][0]).toContain('docker build');
    expect(exec.mock.calls[2][0]).toContain('-t foo/bar:latest');
    expect(exec.mock.calls[2][0]).toContain('--build-arg BAR_VERSION=latest');

    expect(exec.mock.calls[3][0]).toContain('docker push');
    expect(exec.mock.calls[3][0]).toContain('foo/bar:latest');
  });

  it('should allow the usage of raw version tags.', async () => {
    await defaultFlow({
      tags: ['2.2.1', '3.0.0'],
      image: 'foo/bar',
      arg: 'BAR_VERSION'
    });

    expect(exec).toHaveBeenCalledTimes(6);
    expect(exec.mock.calls[0][0]).toContain('docker build');
    expect(exec.mock.calls[0][0]).toContain('-t foo/bar:2.2.1');
    expect(exec.mock.calls[0][0]).toContain('--build-arg BAR_VERSION=2.2.1');

    expect(exec.mock.calls[1][0]).toContain('docker push');
    expect(exec.mock.calls[1][0]).toContain('foo/bar:2.2.1');

    expect(exec.mock.calls[2][0]).toContain('docker build');
    expect(exec.mock.calls[2][0]).toContain('-t foo/bar:3.0.0');
    expect(exec.mock.calls[2][0]).toContain('--build-arg BAR_VERSION=3.0.0');

    expect(exec.mock.calls[3][0]).toContain('docker push');
    expect(exec.mock.calls[3][0]).toContain('foo/bar:3.0.0');

    expect(exec.mock.calls[4][0]).toContain('docker build');
    expect(exec.mock.calls[4][0]).toContain('-t foo/bar:latest');
    expect(exec.mock.calls[4][0]).toContain('--build-arg BAR_VERSION=latest');

    expect(exec.mock.calls[5][0]).toContain('docker push');
    expect(exec.mock.calls[5][0]).toContain('foo/bar:latest');
  });

  it('should allow the usage a custom latest tag.', async () => {
    await defaultFlow({
      tags: [],
      image: 'foo/bar',
      arg: 'BAR_VERSION',
      latest: '5.0.1'
    });

    expect(exec).toHaveBeenCalledTimes(2);
    expect(exec.mock.calls[0][0]).toContain('docker build');
    expect(exec.mock.calls[0][0]).toContain('-t foo/bar:latest');
    expect(exec.mock.calls[0][0]).toContain('--build-arg BAR_VERSION=5.0.1');

    expect(exec.mock.calls[1][0]).toContain('docker push');
    expect(exec.mock.calls[1][0]).toContain('foo/bar:latest');
  });

  it('should allow the stripping of parts from the version tags.', async () => {
    await defaultFlow({
      tags: ['2.2.1-alpine', '3.0.0-alpine'],
      image: 'foo/bar',
      strip: '-alpine',
      arg: 'BAR_VERSION'
    });

    expect(exec.mock.calls[0][0]).toContain('-t foo/bar:2.2.1');
    expect(exec.mock.calls[0][0]).toContain(
      '--build-arg BAR_VERSION=2.2.1-alpine'
    );
    expect(exec.mock.calls[1][0]).toContain('foo/bar:2.2.1');

    expect(exec.mock.calls[2][0]).toContain('-t foo/bar:3.0.0');
    expect(exec.mock.calls[2][0]).toContain(
      '--build-arg BAR_VERSION=3.0.0-alpine'
    );
    expect(exec.mock.calls[3][0]).toContain('foo/bar:3.0.0');
  });
});
