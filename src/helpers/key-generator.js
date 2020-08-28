// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

const key1 = crypto.randomBytes(32).toString('hex');
const key2 = crypto.randomBytes(32).toString('hex');

// eslint-disable-next-line no-console
console.table({ key1, key2 });
