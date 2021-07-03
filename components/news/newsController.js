const fs = require('fs');

const usersModel = require('./newsModel');

module.exports.getNews = async (req, res, next) => {
    res.render('news/newsViews/news', {
        title: 'Новости'
    });
};