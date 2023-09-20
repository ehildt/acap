module.exports = {
  branches: [
    'main',
    'dev',
    'feat/*'
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    // '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git',
  ],
  preset: 'conventionalcommits',
};
