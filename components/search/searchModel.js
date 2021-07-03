const db = require('../../databases/mongoDB');

module.exports.getDocumentNumber = (text, filter) => {
    return new Promise((resolve, reject) => {
        db
        .getDocumentNumber(text, filter)
        .then(documents => {
            resolve(documents.map(doc => doc.numbers));
        })
        .catch(err => {
            reject(err);
        });
    });
};

