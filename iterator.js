'use strict';

function sortArray(array) {
    var newArray = Array.from(array);
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
        
        // Создаём следующий уровень друзей
        for (var i = 0, l = people[currentDepth - 1].length; i < l; i++) {// По уровню людей
            friends = [];
            var lf = collection[ people[currentDepth - 1][i] ].friends.length;
            for (var j = 0; j < lf; j++) {// По друзьям человека
                if (!valueIn(people, collection[people[currentDepth - 1][i]].friends[j]) &&
                    collection[ collection[people[currentDepth - 1][i]].friends[j] ]) {
                    friends.push(collection[ people[currentDepth - 1][i] ].friends[j]);
                }
            }
            friends = sortArray(friends);
            people[currentDepth] = people[currentDepth].concat(friends);
        }
    }
    return people;
}

module.exports.get = function (collection, startPoint, depth) {
    depth = depth || Number.MAX_VALUE;
    var currentFriend = -1;
    var people = [[startPoint]];// Массив с уровнями друзей
    var currentDepth = 1;

    if (collection[startPoint]) {
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
        var friends = [];
        var friend = {};
        
        people = createRelations(collection, startPoint, currentDepth);
        if (people[currentDepth].length <= currentFriend) {
            currentFriend = people[currentDepth].length - 1;
        }
        
        currentFriend++;
        if (currentFriend >= people[currentDepth].length) {// Если больше нет друзей текущей глубины
            if (currentDepth + 1 > depth) {// Если больше нельзя идти вглубь
                currentFriend--;
                return null;
            } else {// Идём вглубь
                currentFriend = 0;
                currentDepth++;
                
                people = createRelations(collection, startPoint, currentDepth);
                if (people[currentDepth].length <= currentFriend) {
                    currentFriend = people[currentDepth].length - 1;
                }

                if (!people[currentDepth].length) {
                    return null;
                }
            }
        }
        if (collection [ people[currentDepth][currentFriend] ]) {// Если друг есть в книге
            friend = {
                name: people[currentDepth][currentFriend],
                phone: collection [ people[currentDepth][currentFriend] ].phone
            };
            if (name === undefined || name === friend.name) {
                return friend;
            } else {
                return next(name);
            }

        } else {// Если друга нет в книге, удалим его из людей
            people[currentDepth].splice(currentFriend, 1);
            return next(name);
        }
    };

    var prevFunction = function prev(name) {
        var friend = {};
        
        people = createRelations(collection, startPoint, currentDepth);
        if (people[currentDepth].length <= currentFriend) {
            currentFriend = people[currentDepth].length - 1;
        }
        
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
        if (collection [ people[currentDepth][currentFriend] ]) {// Если друг есть в книге
            friend = {
                name: people[currentDepth][currentFriend],
                phone: collection [ people[currentDepth][currentFriend] ].phone
            };
            if (name === undefined || name === friend.name) {
                return friend;
            } else {
                return prev(name);
            }

        } else {// Если друга нет в книге, удалим его из людей
            people[currentDepth].splice(currentFriend, 1);
            return prev(name);
        }
    };

    return {
        next: nextFunction,
        prev: prevFunction,
        nextMale: function (name) {
            var person;
            while (person = nextFunction(name)) {
                if (collection[person.name].gender === 'Мужской') {
                    return person;
                }
            }
            return null;
        },
        prevMale: function (name) {
            var person;
            while (person = prevFunction(name)) {
                if (collection[person.name].gender === 'Мужской') {
                    return person;
                }
            }
            return null;
        }
    };
};
