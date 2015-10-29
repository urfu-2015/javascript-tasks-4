'use strict';
require('babel/polyfill');
var assign = require('object-assign');
var origin = require('../faceBook');
var iterator = require('../dist/iterator');
var expect = require('chai').expect;

require('chai').should();

describe('Базовое тестирование итератора', function () {
    var faceBook;

    function getRecord(name) {
        return Object.assign({name: name}, faceBook[name]);
    }

    beforeEach(function () {
        faceBook = assign({}, origin);
    });

    it('Метод next() должен возвращать следующего друга', function () {
        var friends = iterator.get(faceBook, 'Сергей', 3);

        friends.next().should.deep.equal(getRecord('Васян'));
    });

    it('Метод prev() должен возвращать предыдущего друга', function () {
        var friends = iterator.get(faceBook, 'Сергей', 3);

        friends.next();
        friends.next();

        friends.prev().should.deep.equal(getRecord('Васян'));
    });

    it('Метод prev() должен возвращать null, если нет предыдущего друга', function () {
        var friends = iterator.get(faceBook, 'Сергей', 3);

        friends.next();
        friends.next();
        friends.prev();
        friends.prev();

        expect(friends.prev()).to.equal(null);
    });

    it('Метод next() должен возвращать null, если нет следующего друга', function () {
        var friends = iterator.get({
            'Лена': {
                gender: 'Женский',
                phone: '+70000000000',
                friends: []
            }
        }, 'Лена', 3);

        expect(friends.next()).to.equal(null);
    });

    it('Метод next() должен возвращать null, если нет стартовой точки нет в книге', function () {
        var friends = iterator.get(faceBook, 'Игнатий', 3);

        expect(friends.next()).to.equal(null);
    });

    it('Метод prev() должен возвращать null, если нет стартовой точки нет в книге', function () {
        var friends = iterator.get(faceBook, 'Игнатий', 3);

        expect(friends.prev()).to.equal(null);
    });

    it('Метод next() должен учитывать параметр depth', function () {
        var friends = iterator.get(faceBook, 'Сергей', 1);

        friends.next(); // Васян
        friends.next(); // Полина

        // Больше друзей в круге первом нет
        expect(friends.next()).to.equal(null);
    });

    it('next учитывает name', function () {
        var friends = iterator.get(faceBook, 'Сергей', 3);
        // Больше друзей в круге первом нет
        friends.next('Дарья (Пиратка)').should.deep.equal(getRecord('Дарья (Пиратка)'));
    });

    it('prev учитывает name', function () {
        var friends = iterator.get(faceBook, 'Сергей', 3);
        friends.next();
        friends.next();
        friends.next();
        friends.next();
        friends.next();

        // Больше друзей в круге первом нет
        friends.prev('Васян').should.deep.equal(getRecord('Васян'));
    });

    it('nextMale', function () {

        var friends = iterator.get(faceBook, 'Сергей', 3);
        friends.nextMale().gender.should.equal('Мужской');
        friends.nextMale().gender.should.equal('Мужской');
        friends.nextMale().gender.should.equal('Мужской');
        friends.nextMale().gender.should.equal('Мужской');

    });

    it('prevMale', function () {

        var friends = iterator.get(faceBook, 'Сергей', 3);

        friends.next();
        friends.next();
        friends.next();
        friends.next();
        friends.next();

        friends.prevMale().gender.should.equal('Мужской');
        friends.prevMale().gender.should.equal('Мужской');


    });
});
