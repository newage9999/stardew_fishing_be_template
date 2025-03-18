const TestSequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends TestSequencer {
  sort(tests) {
    return tests.sort((a, b) => a.path.localeCompare(b.path));
  }
}

module.exports = CustomSequencer;
