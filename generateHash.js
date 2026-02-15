const bcrypt = require('bcryptjs');

const password = 'ivan123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) console.error(err);
    console.log('\n--- COPY THE HASH BELOW ---');
    console.log(hash);
    console.log('---------------------------\n');
});