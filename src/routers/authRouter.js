const express = require('express');
const debug = require('debug')('app:authRouter');
const { MongoClient, ObjectId } = require('mongodb');
const passport = require('passport');
const authRouter = express.Router();

authRouter.route('/signUp').post((req, res) => {
  const { username, password } = req.body;
  const url =
    'mongodb+srv://dbUser:xSNB5tMZYM0H6eWh@cluster0.pdarjsc.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'globomantics';

  (async function addUser() {
    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);
      const user = { username, password };
      const results = await db.collection('users').insertOne(user);
      debug(results);
      req.login(results.ops[0], () => {
        res.redirect('/auth/profile');
      });
    } catch (error) {
      debug(error);
    }
    client.close();
  })();

  req.login(req.body, () => {
    res.redirect('/auth/profile');
  });
});
authRouter
  .route('/signIn')
  .get((req, res) => {
    res.render('signin');
  })
  .post(passport.authenticate('local'), (req, res) => {
    // <- Corrected line
    res.redirect('/auth/profile'); // <- Corrected line
  });
authRouter.route('/profile').get((req, res) => {
  res.json(req.user);
});

module.exports = authRouter;
