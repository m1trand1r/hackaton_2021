const fs = require('fs');

const searchModel = require('./searchModel');

module.exports.getSearch = async (req, res, next) => {
    res.render('search/searchViews/search', {
        title: 'Поиск'
    });
};

module.exports.postSearch = async (req, res, next) => {
    res.render('search/searchViews/search', {
        title: 'Поиск'
    });
};