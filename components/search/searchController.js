const fs = require('fs');
const path = require('path');
const async = require('async');

const searchModel = require('./searchModel');

let files = null;

function getFiles(dirPath, callback) {
    fs.readdir(dirPath, function (err, files) {
        if (err) return callback(err);
        var filePaths = [];
        async.eachSeries(files, function (fileName, eachCallback) {
            var filePath = path.join(dirPath, fileName);
            fs.stat(filePath, function (err, stat) {
                if (err) return eachCallback(err);
                if (stat.isDirectory()) {
                    getFiles(filePath, function (err, subDirFiles) {
                        if (err) return eachCallback(err);

                        filePaths = filePaths.concat(subDirFiles);
                        eachCallback(null);
                    });

                } else {
                    if (stat.isFile()) {
                        filePaths.push(filePath);
                    }

                    eachCallback(null);
                }
            });
        }, function (err) {
            callback(err, filePaths);
        });

    });
}

module.exports.getSearch = (req, res, next) => {
    res.render('search/searchViews/search', {
        title: 'Поиск'
    });
};

module.exports.postSearch = async (req, res, next) => {   
    try {
        if (req.body && req.body.text) {
            getFiles('./fond', async function (err, files) {
                if (err) throw err;
                let text = '';
                let result = null;
                let documentsNumbers = [];
                if (req.body.filter && req.body.filter != 'default') {
                    documentsNumbers = (await searchModel.getDocumentNumber(req.body.text, req.body.filter)).flat();
                    console.log(documentsNumbers);
                    result = files.filter(file => documentsNumbers.some(doc => file.split('/')[3].toLocaleLowerCase().includes(doc)));
                } else {
                    text = req.body.text;
                    result = files.filter(file => file.toLocaleLowerCase().includes(req.body.text.toLocaleLowerCase()));
                }
                console.log(result);
                res.json(result);
            });
        } else {
            throw new Error('Body пуст.');
        }
    } catch (err) {
        err.status = 500;
        next(err);
    }
};