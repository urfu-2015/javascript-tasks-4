'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var iterator = {
        depth: depth || collection.length,
        currentDepth: 0,
        currentPerson: 0,
        pointToChangeDepth: 0,
        parent: [],
        rightStart: (!(startPoint === undefined) && (startPoint in collection)),
        queue: []
    };

    // начальные данные, первый уровень друзей
    if (iterator.rightStart) {
        iterator.queue = iterator.queue.concat(startPoint);
        iterator.parent = iterator.parent.concat(null);
        iterator.queue = iterator.queue.concat(collection[startPoint].friends.sort());
        collection[startPoint].friends.forEach(function (person) {
            iterator.parent = iterator.parent.concat(iterator.currentPerson);
        });
        iterator.pointToChangeDepth = iterator.queue.length;
        iterator.currentDepth++;
    }

    iterator.next = function (name) {
        if (!iterator.rightStart ||
            iterator.currentPerson + 1 === iterator.queue.length ||
            iterator.depth < iterator.currentDepth) {
            return null;
        }
        while (true) {
            iterator.currentPerson++;
            // изменяем, и проверяем глубину
            if (iterator.pointToChangeDepth === iterator.currentPerson) {
                iterator.currentDepth++;
                iterator.pointToChangeDepth = iterator.queue.length;
                if (iterator.depth < iterator.currentDepth) {
                    return null;
                }
            }
            // записываем новых друзей в очередь.
            var newPeople = (collection[iterator.queue[iterator.currentPerson]].friends).filter(
                function isNewFriend(person) {
                return (iterator.queue.indexOf(person) === -1) && (person !== startPoint);
            }).sort();
            iterator.queue = iterator.queue.concat(newPeople);
            newPeople.forEach(function (person) {
                iterator.parent = iterator.parent.concat(iterator.currentPerson);
            });
            if (name === undefined || name === iterator.queue[iterator.currentPerson]) {
                var answer = {
                    name: iterator.queue[iterator.currentPerson],
                    phone: collection[iterator.queue[iterator.currentPerson]].phone
                };
                return answer;
            }
        }
    };

    iterator.prev = function () {
        if (!iterator.rightStart || iterator.currentPerson === 0) {
            return null;
        }
        //iterator.currentPerson = iterator.parent[iterator.currentPerson];
        iterator.currentPerson--;
        var answer = {
            name: iterator.queue[iterator.currentPerson],
            phone: collection[iterator.queue[iterator.currentPerson]].phone
        };
        return answer;
    };

    iterator.nextMale = function (name) {
        if (!iterator.rightStart ||
            iterator.queue.length === 0 ||
            iterator.depth < iterator.currentDepth) {
            return null;
        }
        var answer = iterator.next(name);
        while (!(answer === null) && !(collection[answer.name].gender === 'Мужской')) {
            answer = iterator.next(name);
        }
        return answer;
    };

    iterator.prevMale = function () {
        if (!iterator.rightStart || iterator.currentPerson === 0) {
            return null;
        }
        var answer = iterator.prev();
        while (!(answer === null) && !(collection[answer.name].gender === 'Мужской')) {
            answer = iterator.prev();
        }
        return answer;
    };
    return iterator;
};
