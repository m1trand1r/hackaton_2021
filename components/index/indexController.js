const fs = require('fs');

const indexModel = require('./indexModel');

module.exports.getIndex = (req, res, next) => {
    res.render('news/newsViews/news', {
        title: 'Новости'
    });
};

module.exports.getLogin = (req, res, next) => {
    res.render('index/indexViews/login', {
        title: 'Вход'
    });
};

module.exports.getRegistration = (req, res, next) => {
    res.render('index/indexViews/registration', {
        title: 'Регистрация'
    });
}

module.exports.getLogout = function(req, res) {
    res.redirect('/login');
};