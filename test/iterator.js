'use strict';

var assign = require('object-assign');
var origin = require('../faceBook');
var iterator = require('../iterator');
var expect = require('chai').expect;

require('chai').should();

describe('Базовое тестирование итератора', function () {
    var faceBook;

    beforeEach(function () {
        faceBook = assign({}, origin);
    });

    it('Метод next() должен возвращать следующего друга', function () {
        var friends = iterator.get(faceBook, 'Сергей', 3);

        friends.next().should.have.keys({ name: 'Васян', phone: '+70000000000' });
    });

    it('Метод prev() должен возвращать предыдущего друга', function () {
        var friends = iterator.get(faceBook, 'Сергей', 3);

        friends.next();
        friends.next();

        friends.prev().should.have.keys({ name: 'Васян', phone: '+70000000000' });
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

    it('Метод next() должен возвращать null, если стартовой точки нет в книге', function () {
        var friends = iterator.get(faceBook, 'Игнатий', 3);

        expect(friends.next()).to.equal(null);
    });

    it('Метод prev() должен возвращать null, если стартовой точки нет в книге', function () {
        var friends = iterator.get(faceBook, 'Игнатий', 3);

        expect(friends.prev()).to.equal(null);
    });

    it('Метод next() должен учитывать параметр depth', function () {
        var friends = iterator.get(faceBook, 'Сергей', 1);

        friends.next(); // Васян
        friends.next(); // Полина

        // Больше друзей в первом круге нет
        expect(friends.next()).to.equal(null);
    });
});
