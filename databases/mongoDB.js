const mongoDB = require('../mongoDB.json');
const MongoClient = require('mongodb').MongoClient;

const bcrypt = require('bcryptjs');

const MONGODB_URI = mongoDB.URI;

ObjectId = require('mongodb').ObjectID;

const mongoClient = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });

let dbClient = null;

mongoClient.connect(function (err, client) { // Подключение к БД
  if (err) throw err
  dbClient = client;
});