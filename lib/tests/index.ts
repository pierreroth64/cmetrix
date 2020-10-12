export function createLoggerMock() {
  return {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

export function createFileOpsMock() {
  return {
    doesExist: jest.fn().mockResolvedValue(true),
    createDirectory: jest.fn().mockResolvedValue(undefined),
    createTemporaryDirectory: jest.fn().mockResolvedValue('temp'),
    find: jest.fn().mockResolvedValue(undefined),
    readJson: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(undefined),
    writeText: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };
}

export function createGitMock() {
  return {
    clone: jest.fn().mockResolvedValue(undefined),
    checkout: jest.fn().mockResolvedValue(undefined),
  };
}
