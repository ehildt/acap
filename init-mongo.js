/* eslint-disable no-undef */

db.createUser({
  user: 'mongo',
  pwd: 'mongo',
  roles: [{ role: 'readWrite', db: 'configs' }],
});
