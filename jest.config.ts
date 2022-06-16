// ts-unused-exports:disable-next-line
export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy',
  },
  collectCoverageFrom: [
    '!**/dist/**',
    '!**/dtos/**',
    '!**/mocks/**',
    '!**/open-api/**',
    '!**/node_modules/**',
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '<rootDir>/src/coverage',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleDirectories: ['node_modules'],
};
