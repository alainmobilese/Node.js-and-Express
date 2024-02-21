const passport = require('passport');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:localStrategy');
const { MongoClient } = require('mongodb');
module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      (username, password, done) => {
        const url =
          'mongodb+srv://dbUser:xSNB5tMZYM0H6eWh@cluster0.pdarjsc.mongodb.net/?retryWrites=true&w=majority';
        const dbName = 'globomantics';
        (async function validateUser() {
          let client;
          try {
            client = await MongoClient.connect(url);
            debug('Connected to mongo DB');

            const db = client.db(dbName);

            const user = await db.collection('users').findOne({ username });
            if (user && user.password === password) {
              done(null, user);
            } else {
              done(null, false);
            }
          } catch (error) {
            done(error, false);
          }
          client.close();
        });
      }
    )
  );
};
