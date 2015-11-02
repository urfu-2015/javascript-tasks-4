'use strict';

function sortArray(array) {
    var newArray = array;
    var l = newArray.length;
    var buffer;
    for (var i = 0; i < l - 1; i++) {
        for (var j = i + 1; j < l; j++) {
            if (newArray[i] > newArray[j]) {
                buffer = newArray[i];
                newArray[i] = newArray[j];
                newArray[j] = buffer;
            }
        }
    }
    return newArray;
}

function valueIn(arrays, value) {
    for (var i = 0, l = arrays.length; i < l; i++) {
        for (var j = 0, ll = arrays[i].length; j < ll; j++) {
            if (arrays[i][j] === value) {
                return true;
            }
        }
    }
    return false;
}

function createRelations(collection, startPoint, depth) {
    var people = [[startPoint]];// Массив с уровнями друзей
    var currentDepth = 0;
    var friends = [];

    while (currentDepth < depth) {
        currentDepth++;
        people[currentDepth] = [];

        /*Создаём следующий уровень друзей
        Для каждого человека находим всех друзей и добавляем их в массив связей, только
        если они есть в книге контактов и их еще нет в массиве связей*/
        people[currentDepth - 1].forEach(function (man) {// Для каждого человека
            friends = [];
            collection[man].friends.forEach(function (friendOfMan) {// Для каждого друга человека
                if (!valueIn(people, friendOfMan) && collection[friendOfMan]) {
                    friends.push(friendOfMan);
                }
            });
            friends = sortArray(friends);
            people[currentDepth] = people[currentDepth].concat(friends);
        });
    }
    return people;
}

function manInCollection(collection, man) {
    if (collection[man]) {
        return {
            name: man,
            phone: collection[man].phone
        };
    } else {
        return null;
    }
}

module.exports.get = function (collection, startPoint, depth) {
    (depth === undefined) ? depth = Number.MAX_VALUE : Number(depth);
    if (isNaN(depth) && depth < 0) {
        throw new Error('Invalid depth type: ' + depth);
    }
    var currentFriend = -1;
    var people = [[startPoint]];// Массив с уровнями друзей
    var currentDepth = 1;

    if (collection[startPoint] && depth) {
        people.push(sortArray(collection[startPoint].friends));
    } else {
        return {
            next: function (name) {
                return null;
            },
            prev: function (name) {
                return null;
            },
            nextMale: function (name) {
                return null;
            },
            prevMale: function (name) {
                return null;
            }
        };
    }

    var nextFunction = function next(name) {
        currentFriend++;
        if (currentFriend >= people[currentDepth].length) {// Если больше нет друзей текущей глубины
            if (currentDepth + 1 > depth) {// Если больше нельзя идти вглубь
                currentFriend--;
                return null;
            } else {// Идём вглубь
                currentFriend = 0;
                currentDepth++;

                people = createRelations(collection, startPoint, currentDepth);

                if (!people[currentDepth].length) {
                    return null;
                }
            }
        }
        var friend = manInCollection(collection, people[currentDepth][currentFriend]);
        if (friend) {// Если друг есть в книге
            if (name === undefined || name === friend.name) {
                return friend;
            } else {
                return next(name);
            }
        } else {// Если друга нет в книге, заного построим связи между людьми
            people = createRelations(collection, startPoint, currentDepth);
            if (people[currentDepth].length <= currentFriend) {
                currentFriend = people[currentDepth].length - 1;
            }

            return next(name);
        }
    };

    var prevFunction = function prev(name) {
        currentFriend--;
        if (currentFriend < 0) {// Если больше нет друзей текущей глубины
            if (currentDepth - 1 == 0) {// Если больше нельзя всплывать
                currentFriend = 0;
                return null;
            } else {// Всплываем
                currentDepth--;
                currentFriend = people[currentDepth].length - 1;
            }
        }
        var friend = manInCollection(collection, people[currentDepth][currentFriend]);
        if (friend) {// Если друг есть в книге
            if (name === undefined || name === friend.name) {
                return friend;
            } else {
                return prev(name);
            }
        } else {// Если друга нет в книге, заного построим связи между людьми
            people = createRelations(collection, startPoint, currentDepth);
            if (people[currentDepth].length <= currentFriend) {
                currentFriend = people[currentDepth].length - 1;
            }

            return prev(name);
        }
    };

    var getMan = function (name, prev) {
        var func;
        (prev) ? func = prevFunction : func = nextFunction;
        var person;
        while (person = func(name)) {
            if (collection[person.name].gender === 'Мужской') {
                return person;
            }
        }
        return null;
    };

    return {
        next: nextFunction,
        prev: prevFunction,
        nextMale: function (name) {
            return getMan(name);
        },
        prevMale: function (name) {
            return getMan(name, true);
        }
    };
};
