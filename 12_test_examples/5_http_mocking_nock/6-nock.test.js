// its hard to "fake" a real http server because of protocol complexities.
// nock - a library to test http calls.
// nocks can catch http requests before called online, 
// and return a response as if it came from a real server

// We'd like to check 2 scenarios - code 200 and body response if successful
// or throws error if not

const nock = require('nock');
const assert = require('assert');

describe('nock demo', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return the number of stars from github', async () => {
    // Arrange
    const { getElementorRepoStarCount } = require('./github');
    const expected = 123456;
    nock('https://api.github.com')
      .get('/repos/elementor/elementor')
      .reply(200, {
        stargazers_count: expected
      });
    // Act
    const actual = await getElementorRepoStarCount();
    // Assert
    assert.strictEqual(actual, expected);
  });

  it('should throw an error on status other than 2xx', async () => {
    // Arrange
    const { getElementorRepoStarCount } = require('./github');
    nock('https://api.github.com')
      .get('/repos/elementor/elementor')
      .reply(408); // Request Timeout
    // Act
    const actual = getElementorRepoStarCount();
    // Assert
    await assert.rejects(actual);
  });
});