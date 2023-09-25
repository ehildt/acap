'use strict';

module.exports = {
  preset: 'conventionalcommits',
  branches: [
    { name: 'main' },
    { name: 'dev', channel: 'beta', prerelease: 'beta' },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { breaking: true, release: 'major' },
          { revert: true, release: 'patch' },
          { type: 'chore', release: false },
          { type: 'chore', scope: 'deps', release: 'patch' },
          { type: 'docs', scope: 'README', release: 'patch' },
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'ci', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'refactor', release: 'patch' },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'build', section: 'CI/CD' },
            { type: 'ci', section: 'CI/CD' },
            { type: 'chore', section: 'Miscellaneous', hidden: true },
            { type: 'chore', scope: 'deps', section: 'Dependency Updates' },
            { type: 'chore', scope: 'dev-deps', section: 'Dependency Updates' },
            { type: 'docs', section: 'Documentation' },
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'perf', section: 'Code Refactoring' },
            { type: 'refactor', section: 'Code Refactoring' },
            { type: 'style', section: 'Code Refactoring' },
            { type: 'test', section: 'Tests' },
          ],
        },
      },
    ],
    [
      '@semantic-release/changelog',
      { changelogFile: 'CHANGELOG.md' },
    ],
    [
      '@semantic-release/npm',
      { npmPublish: false },
    ],
    [
      '@semantic-release/github',
      {},
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ]
  ],
};
