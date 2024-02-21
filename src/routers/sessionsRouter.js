const express = require('express');
const sessionsRouter = express.Router();
const sessions = require('../data/sessions');
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectId } = require('mongodb');

sessionsRouter.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('auth/signIn');
  }
});
sessionsRouter.route('/').get((req, res) => {
  const url =
    'mongodb+srv://dbUser:xSNB5tMZYM0H6eWh@cluster0.pdarjsc.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'globomantics';

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug('Connected to mongo DB');

      const db = client.db(dbName);
      const sessions = await db.collection('sessions').find().toArray();
      res.render('sessions', { sessions });
    } catch (error) {
      debug(error.stack);
    }
    client.close();
  })();
});

sessionsRouter.route('/:id').get((req, res) => {
  const id = req.params.id;
  const url =
    'mongodb+srv://dbUser:xSNB5tMZYM0H6eWh@cluster0.pdarjsc.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'globomantics';

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug('Connected to mongo DB');

      const db = client.db(dbName);
      const session = await db
        .collection('sessions')
        .findOne({ _id: new ObjectId(id) });
      res.render('session', {
        session,
      });
    } catch (error) {
      debug(error.stack);
    }
  })();
});

module.exports = sessionsRouter;
