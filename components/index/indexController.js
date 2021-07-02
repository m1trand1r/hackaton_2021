const fs = require('fs');

const indexModel = require('./indexModel');

module.exports.getIndex = async (req, res, next) => {
    res.render('index/indexViews/index', {
        title: 'Главная'
    });
};

module.exports.getLogin = async (req, res, next) => {
    res.render('index/indexViews/login', {
        title: 'Вход'
    });
};

module.exports.getLogout = function(req, res) {
    res.redirect('/login');
};