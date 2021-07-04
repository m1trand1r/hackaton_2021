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
    if (req.query.text) {
        getFiles('./fond', async function (err, files) {
            if (err) throw err;
            let text = '';
            let result = null;
            let documentsNumbers = [];
            if (req.query.filter && req.query.filter != 'default') {
                documentsNumbers = (await searchModel.getDocumentNumber(req.query.text, req.query.filter)).flat();
                result = files.filter(file => documentsNumbers.some(doc => file.split('\\')[3].toLocaleLowerCase().includes(doc)));
            } else {
                text = req.query.text;
                result = files.filter(file => {
                    let lowerFile = file.toLocaleLowerCase();
                    let lowerFileArr = lowerFile.split('\\');
                    let lowerText = req.query.text.toLocaleLowerCase();
                    if (lowerFileArr[1].includes(lowerText) || lowerFileArr[2].includes(lowerText) || lowerFileArr[3].includes(lowerText)) {
                        return true
                    }
                    return false;
                });
            }
            result = result.map(doc => {
                let docArr = doc.split('\\');
                return {
                    path: doc,
                    fund: docArr[1],
                    inventory: docArr[2],
                    document: docArr[3],
                    imageName: docArr[4]
                }
            });
            let resultMap = new Map();
            for (let doc of result) {
                let key = `${doc.fund}/${doc.inventory}/${doc.document}`;
                if (!resultMap.has(key)) {
                    resultMap.set(key, {
                        documents: [{
                        imageName: doc.imageName,
                        path: doc.path
                    }]});
                } else {
                    resultMap.set(key, {
                        documents: [{
                        index: files.indexOf(doc.path),
                        imageName: doc.imageName,
                        path: doc.path
                    }, ...resultMap.get(key).documents]});
                }
            }
            res.render('search/searchViews/search', {
                title: 'Поиск',
                result: Object.fromEntries(resultMap.entries()),
                text: text 
            });
        });
    } else {
        res.render('search/searchViews/search', {
            title: 'Поиск',
            result: null
        });
    }
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
                    result = files.filter(file => documentsNumbers.some(doc => file.split('\\')[3].toLocaleLowerCase().includes(doc)));
                } else {
                    text = req.body.text;
                    result = files.filter(file => {
                        let lowerFile = file.toLocaleLowerCase();
                        let lowerFileArr = lowerFile.split('\\');
                        let lowerText = req.body.text.toLocaleLowerCase();
                        if (lowerFileArr[1].includes(lowerText) || lowerFileArr[2].includes(lowerText) || lowerFileArr[3].includes(lowerText)) {
                            return true
                        }
                        return false;
                    });
                }
                result = result.map(doc => {
                    let docArr = doc.split('\\');
                    return {
                        path: doc,
                        fund: docArr[1],
                        inventory: docArr[2],
                        document: docArr[3],
                        imageName: docArr[4]
                    }
                });
                let resultMap = new Map();
                for (let doc of result) {
                    let key = `${doc.fund}/${doc.inventory}/${doc.document}`;
                    if (!resultMap.has(key)) {
                        resultMap.set(key, {
                            documents: [{
                            index: files.indexOf(doc.path),
                            imageName: doc.imageName,
                            path: doc.path
                        }]});
                    } else {
                        resultMap.set(key, {
                            documents: [{
                            index: files.indexOf(doc.path),
                            imageName: doc.imageName,
                            path: doc.path
                        }, ...resultMap.get(key).documents]});
                    }
                }
                res.json(Object.fromEntries(resultMap.entries()));
            });
        } else {
            throw new Error('Body пуст.');
        }
    } catch (err) {
        err.status = 500;
        next(err);
    }
};