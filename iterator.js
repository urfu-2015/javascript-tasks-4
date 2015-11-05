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
    (depth === undefined) ? depth = Number.MAX_VALUE : depth = Number(depth);
    if (isNaN(depth) && depth < 0) {
        throw new Error('Invalid depth: ' + depth);
    }

    if (!collection[startPoint] || !depth) {
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

    var currentFriendName = startPoint;
    var currentFriend = 0;
    var currentDepth = 0;
    var people = [[startPoint]];// Массив с уровнями друзей

    var createRelations = function () {// Создает все возможные связи между друзьями
        var people = [[startPoint]];// Массив с уровнями друзей
        var currDepth = 0;
        var friends = [];
        var isCurrFriendInPeople = (currentFriendName === null ||
                                    currentFriendName === startPoint) ? true : false;

        while (currDepth < depth) {
            currDepth++;
            people[currDepth] = [];

            /*Создаём следующий уровень друзей
            Для каждого человека находим всех друзей и добавляем их в массив связей, только
            если они есть в книге контактов и их еще нет в массиве связей*/
            people[currDepth - 1].forEach(function (man) {// Для каждого человека
                friends = [];
                collection[man].friends.forEach(function (friendOfMan) {//Для каждого друга человека
                    if (!valueIn(people, friendOfMan) && collection[friendOfMan]) {
                        friends.push(friendOfMan);
                        if (!isCurrFriendInPeople && friendOfMan === currentFriendName) {
                            currentDepth = currDepth;
                            isCurrFriendInPeople = true;
                        }
                    }
                });
                friends = sortArray(friends);
                people[currDepth] = people[currDepth].concat(friends);
            });
            if (people[currDepth].indexOf(currentFriendName) !== -1) {
                currentFriend = people[currDepth].indexOf(currentFriendName);
            }
            if (!people[currDepth].length) {
                depth = currDepth - 1;
                people.pop();
                break;
            }
        }
        if (isCurrFriendInPeople) {
            return people;
        } else {
            currentFriend = 0;
            currentDepth = 0;
            return [];
        }
    };

    var nextFunction = function next(name) {
        people = createRelations();
        if (!people.length) {
            return null;
        }
        currentFriend++;
        if (currentFriend >= people[currentDepth].length) {// Если больше нет друзей текущей глубины
            if (currentDepth + 1 > depth) {// Если больше нельзя идти вглубь
                currentFriend = people[currentDepth].length;
                currentFriendName = null;
                return null;
            } else {// Идём вглубь
                currentFriend = 0;
                currentDepth++;
            }
        }
        var friend = manInCollection(collection, people[currentDepth][currentFriend]);
        if (friend) {// Если друг есть в книге
            currentFriendName = friend.name;
            if (name === undefined || name === friend.name) {
                return friend;
            } else {
                return next(name);
            }
        } else {// Если друга нет в книге
            currentFriendName = null;
            return null;
        }
    };

    var prevFunction = function prev(name) {
        people = createRelations();
        if (!people.length) {
            currentFriendName = null;
            return null;
        }
        currentFriend--;
        if (currentFriend < 0) {// Если больше нет друзей текущей глубины
            if (currentDepth - 1 === -1) {// Если больше нельзя всплывать
                currentFriend = -1;
                currentFriendName = null;
                return null;
            } else {// Всплываем
                currentDepth--;
                currentFriend = people[currentDepth].length - 1;
            }
        }
        var friend = manInCollection(collection, people[currentDepth][currentFriend]);
        if (friend) {// Если друг есть в книге
            currentFriendName = friend.name;
            if (name === undefined || name === friend.name) {
                return friend;
            } else {
                return prev(name);
            }
        } else {// Если друга нет в книге
            currentFriendName = null;
            return null;
        }
    };

    var getMan = function (name, prev) {
        var func;
        (prev) ? func = prevFunction : func = nextFunction;
        var person;
        while (person = func(name)) {
            if (collection[person.name].gender === 'Мужской') {
                currentFriendName = person.name;
                return person;
            }
        }
        currentFriendName = null;
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
