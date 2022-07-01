'use strict';

module.exports = {
  preset: 'angular',
  branches: [
    {
      name: 'main',
    },
    {
      name: 'next',
      channel: 'next',
      prerelease: 'rc',
    },
    {
      name: 'dev',
      channel: 'beta',
      prerelease: 'beta',
    },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          // Common rules
          { breaking: true, release: 'major' },
          { revert: true, release: 'patch' },
          { scope: 'no-release', release: false },
          // Type specific rules
          { type: 'build', release: false },
          { type: 'ci', release: false },
          { type: 'chore', release: false },
          { type: 'chore', scope: 'dependencies', release: 'patch' },
          { type: 'docs', release: false },
          { type: 'docs', scope: 'README', release: 'patch' },
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'style', release: false },
          { type: 'test', release: false },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'build', section: 'CI/CD Pipelines', hidden: false },
            { type: 'ci', section: 'CI/CD Pipelines', hidden: false },
            { type: 'chore', section: 'Miscellaneous', hidden: true },
            { type: 'chore', scope: 'dependencies', section: 'Dependency Updates', hidden: false },
            { type: 'docs', section: 'Documentation', hidden: false },
            { type: 'feat', section: 'Features', hidden: false },
            { type: 'fix', section: 'Bug Fixes', hidden: false },
            { type: 'perf', section: 'Code Refactoring', hidden: false },
            { type: 'refactor', section: 'Code Refactoring', hidden: false },
            { type: 'style', section: 'Code Refactoring', hidden: false },
            { type: 'test', section: 'Tests', hidden: false },
          ],
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    //[
    //  '@semantic-release/exec',
    //  {
    //    verifyReleaseCmd: 'echo ${nextRelease.version} > VERSION',
    //  },
    //],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    ['@semantic-release/gitlab', {}],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): Release v${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],
    [
      '@saithodev/semantic-release-backmerge',
      {
        branches: [{ from: 'main', to: 'dev' }],
      },
    ],
  ],
};
