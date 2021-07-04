const mongoDB = require('./mongoConfig.json');
const MongoClient = require('mongodb').MongoClient;

const bcrypt = require('bcryptjs');

const MONGODB_URI = mongoDB.URI;

ObjectId = require('mongodb').ObjectID;

const mongoClient = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
//mongoexport --forceTableScan --uri mongodb+srv://destro:29062000@cluster0.i1chw.mongodb.net/hackaton_2021 --collection users --out users.json

let dbClient = null;

mongoClient.connect(function (err, client) { // Подключение к БД
  if (err) throw err
  dbClient = client;
});

module.exports.getUserByEmail = (email) => { // Поиск пользователя по Email
    return new Promise((resolve, reject)=>{
        try {
            dbClient
                .db('hackaton_2021')
                .collection('users')
                .find({ "email": email})
                .toArray(function(err, results){
                    if (err) {
                        reject(err)
                    }
                    resolve(results.length !== 0 ? results[0] : null);
                });
        } catch (err) {
            reject(err);
        }
    })
}

module.exports.comparePassword = (password, userPassword) => {
    return bcrypt.compareSync(password, userPassword);
}

module.exports.getById = (id, collection) => { // Поиск пользователя по ID
    return new Promise((resolve, reject)=>{
        try {
            dbClient
                .db('hackaton_2021')
                .collection(collection)
                .find({ _id: ObjectId(id)})
                .toArray(function(err, results){
                    if (err) {
                        reject(err)
                    }
                    resolve(results.length !== 0 ? results[0] : null);
                });
        } catch (err) {
            reject(err);
        }
    })
}

module.exports.addUser = (userData, companyId = null) => { // Добавление пользователя
    return new Promise((resolve, reject) => {
        try {
            userData.password = bcrypt.hashSync(userData.password, bcrypt.genSaltSync(10));
            if (!companyId) {
            dbClient
                .db('hackaton_2021')
                .collection('users')
                .insertOne(userData, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            } else {
                dbClient
                .db('hackaton_2021')
                .collection('users')
                .updateOne( 
                    { _id: ObjectId(companyId) },
                    {
                        $push: {
                            workers: userData
                        }
                    }, function(err, results) {
                        if (err) {
                            reject(err);
                        }
                        resolve(results);
                    }
                );
            }
        } catch (err) {
            reject(err);
        }      
    })
}

module.exports.deleteUser = (id) => { // Удаление пользователя по Email
    return new Promise((resolve, reject) => {
        try {
            dbClient
                .db('hackaton_2021')
                .collection('users')
                .deleteMany({ _id: ObjectId(id)},
                function(err){
                    if (err) {
                        reject(err);
                    }
                    resolve();
                }); 
        } catch (err) {
            reject(err);
        }       
    });
}

module.exports.getDocumentNumber = (text, collection) => { 
    return new Promise((resolve, reject) => {
        try {
            dbClient
                .db('hackaton_2021')
                .collection(collection)
                .find({ title: { $regex: text, $options: 'i' } })
                .toArray(function(err, results){
                    if (err) {
                        reject(err)
                    }
                    resolve(results);
                });
        } catch (err) {
            reject(err);
        }
    });
};