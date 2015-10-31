'use strict';

function doesUserExists(collection, userName) {
    if (collection[userName]) {
        return true;
    } else {
        return false;
    }
    //Хотел так сократить, но валидатор ругается
    //return !!collection[userName];
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
    startPointFriends = startPointFriends.sort();
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
    depth = depth || Object.keys(collection).length;
    var didFinish = false;
    var currDepth = 0;
    var currIndex = 0;
    var currFriends = [startPoint];
    var newLevel = [];
    var usedFriends = {};
    usedFriends[startPoint] = collection[startPoint];
    return {
        next: function (name) {
            // Имя еще не использую
            if (!doesUserExists(collection, startPoint)) {
                return null;
            }
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
                    var toShow = {};
                    toShow['name'] = currFriends[currIndex];
                    toShow['phone'] = collection[currFriends[currIndex]]['phone'];
                    console.log(toShow);
                    return toShow;
                }
                return null;
            }
            return null;
        },
        prev: function () {
            if (currIndex > 0) {
                currIndex--;
                var toShow = {};
                toShow['name'] = currFriends[currIndex];
                toShow['phone'] = collection[currFriends[currIndex]]['phone'];
                return toShow;
            }
            return null;
        },
        nextMale: function () {
            var nextMale = this.next();
            while (nextMale !== null && collection[nextMale['name']]['gender'] !== 'Мужской') {
                nextMale = this.next();
            }
            return nextMale;
        },
        prevMale: function () {
            var prevMale = this.prev();
            while (prevMale !== null && collection[prevMale['name']]['gender'] !== 'Мужской') {
                prevMale = this.prev();
            }
            return prevMale;
        }
    };
};
