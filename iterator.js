'use strict';

function doesUserExists(collection, userName) {
    return Boolean(collection[userName]);
}

function cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
}

/**
 * Получаем всех друзей первого круга для данного человека
 * При этом учитываем, кого уже посмотрели с помощью usedFriends
 * @param collection
 * @param startPoint
 * @param usedFriends
 * @returns {Array}
 */
function getFriends(collection, startPoint, usedFriends) {
    var startPointFriends = collection[startPoint]['friends'];
    startPointFriends = startPointFriends.sort().filter(function (friend) {
        return collection[friend];
    });
    var startPointNewFriends = [];
    var startPointFriendsLen = startPointFriends.length;
    for (var f = 0; f < startPointFriendsLen; ++f) {
        if (!doesUserExists(usedFriends, startPointFriends[f])) {
            startPointNewFriends.push(startPointFriends[f]);
        }
    }
    return startPointNewFriends;
}

module.exports.get = function (collection, startPoint, depth) {
    depth = depth || Infinity;
    var collectionCopy = cloneObject(collection);
    var didFinish = false;
    var currDepth = 0;
    var currIndex = 0;
    var currFriends = [startPoint];
    var newLevel = [];
    var usedFriends = {};
    var toShow = {};
    var lastShown = {};
    usedFriends[startPoint] = collection[startPoint];
    var _next = function () {
        // Если стартовой точки нет, то сразу закончили
        if (!doesUserExists(collection, startPoint)) {
            didFinish = true;
            return null;
        }
        // Если уже закончили, то продолжаем выдавать null
        if (didFinish) {
            return null;
        }
        // Выдаем друзей до нужной глубины
        if (currDepth < depth) {
            var tmpFriends = getFriends(collection, currFriends[currIndex], usedFriends);
            //Если после 1-ого уровня друзей пусто, то дальше только null
            if (!currDepth && !tmpFriends.length) {
                return null;
            }
            //Формируем следующий уровень, пока просматриваем друзей текущего
            newLevel = newLevel.concat(tmpFriends);
            //Отмечаем тех, кого уже посмотрели
            tmpFriends.forEach(function (item) {
                usedFriends[item] = collection[item];
            });
            currIndex++;
            //Если на новом уровне никого нет, то мы дошли до конца
            if (newLevel.length === 0) {
                didFinish = true;
                return null;
            }
            //Если на данном уровне дошли до конца - спускаемся на след.
            if (currIndex === currFriends.length) {
                currFriends = currFriends.concat(newLevel);
                newLevel = [];
                currDepth++;
            }
            //Готовим вывод, проверив, что не дошли до конца
            if (collection[currFriends[currIndex]]) {
                toShow = {};
                toShow.name = currFriends[currIndex];
                toShow.phone = collection[currFriends[currIndex]]['phone'];
                return toShow;
            }
            return null;
        }
        return null;
    };
    var _recalculateFriends = function () {
        // Попытаемся теперь от начала дойти до последнего выданного человека
        didFinish = false;
        currDepth = 0;
        currIndex = 0;
        currFriends = [startPoint];
        newLevel = [];
        usedFriends = {};
        usedFriends[startPoint] = collection[startPoint];
        var friend = _next();
        // Либо связь потерялась совсем и дойти до последнего выданного
        // не сможем, либо дойдем, пересчитав все по ходу
        while (friend && lastShown.name !== friend.name) {
            friend = _next();
        }
        // Если дойти не смогли, то обратно от этого человека,
        // шаг будет уже нельзя сделать (связей с друзьями не осталось),
        // но возможно, дальше есть кто-то.
        // В этом случае сделаем его стартовой точкой,
        // а дальше сведем к предыдущим случаям
        if (!friend) {
            // Берем за начала того, на котором кого-то удалили
            startPoint = lastShown['name'];
            didFinish = false;
            currDepth = 0;
            currIndex = 0;
            currFriends = [startPoint];
            newLevel = [];
            usedFriends = {};
            usedFriends[startPoint] = collection[startPoint];
        }
    };
    var didCollectionChanged = function () {
        // Раз мы только удаляем, можем сравнить и так на изменение
        if (Object.keys(collection).length !== Object.keys(collectionCopy).length) {
            collectionCopy = cloneObject(collection);
            return true;
        } else {
            return false;
        }
    };
    return {
        next: function (name) {
            if (didCollectionChanged()) {
                _recalculateFriends();
            }
            // Если нам дали имя, просто дойдем до него
            if (doesUserExists(collection, name)) {
                var friend = _next();
                while (friend && name !== friend['name']) {
                    friend = _next();
                }
                lastShown = cloneObject(friend);
                return friend;
            }
            var tmpNext = _next();
            lastShown = cloneObject(tmpNext);
            return tmpNext;
        },
        prev: function () {
            if (didCollectionChanged()) {
                _recalculateFriends();
            }
            if (currIndex > 0) {
                currIndex--;
                toShow = {};
                toShow['name'] = currFriends[currIndex];
                toShow['phone'] = collection[currFriends[currIndex]]['phone'];
                lastShown = cloneObject(toShow);
                return toShow;
            }
            return null;
        },
        nextMale: function () {
            if (didCollectionChanged()) {
                _recalculateFriends();
            }
            var nextMale = this.next();
            while (nextMale && collection[nextMale['name']]['gender'] !== 'Мужской') {
                nextMale = this.next();
            }
            return nextMale;
        },
        prevMale: function () {
            if (didCollectionChanged()) {
                _recalculateFriends();
            }
            var prevMale = this.prev();
            while (prevMale && collection[prevMale['name']]['gender'] !== 'Мужской') {
                prevMale = this.prev();
            }
            return prevMale;
        }
    };
};
