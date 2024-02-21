const express = require('express');
const debug = require('debug')('app:adminRouter');
const { MongoClient } = require('mongodb');
const { restart } = require('nodemon');

const sessions = require('../data/sessions');

const adminRouter = express.Router();

adminRouter.route('/').get((req, res) => {
  const url =
    'mongodb+srv://dbUser:xSNB5tMZYM0H6eWh@cluster0.pdarjsc.mongodb.net/?retryWrites=true&w=majority';
  const dbName = 'globomantics';

  (async function mongo() {
    let client;
    try {
      client = await MongoClient.connect(url);
      debug('Connected to mongo DB');

      const db = client.db(dbName);
      const response = await db.collection('sessions').insertMany(sessions);
      res.json(response);
    } catch (error) {
      debug(error.stack);
    }
  })();
});

module.exports = adminRouter;
