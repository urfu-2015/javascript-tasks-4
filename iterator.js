'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === 0) {
        return null;
    }

    var iterator = {
        depth: depth || Object.keys(collection).length,
        currentDepth: [],
        currentPerson: 0,
        currentPersonName: '',
        collectionLength: 0,
        parent: [],
        rightStart: (!(startPoint === undefined) && (startPoint in collection)),
        queue: []
    };

    // начальные данные, первый уровень друзей
    if (iterator.rightStart) {
        iterator.queue = iterator.queue.concat(startPoint);
        iterator.parent = iterator.parent.concat(null);
        iterator.currentDepth = iterator.currentDepth.concat(0);
        iterator.queue = iterator.queue.concat(collection[startPoint].friends.sort());
        collection[startPoint].friends.forEach(function (person) {
            iterator.parent = iterator.parent.concat(iterator.currentPerson);
        });
        iterator.collectionLength = iterator.queue.length;
        iterator.currentDepth = iterator.currentDepth.concat(
            collection[startPoint].friends.map(function (person) {
            return 1;
        }));
        iterator.currentPersonName = startPoint;
        getNewQueue(startPoint, iterator.currentPerson);
    }

    iterator.next = function (name) {
        if (isCollectionChanged()) {
            iterator.currentPerson = getNewQueue(iterator.currentPersonName,
                iterator.currentPerson);
        };

        if (!iterator.rightStart ||
            iterator.queue.indexOf(iterator.currentPersonName) === -1 ||
            iterator.currentPerson + 1 === iterator.collectionLength ||
            iterator.depth < iterator.currentDepth[iterator.currentPerson + 1] ||
            (name !== undefined && !(name in collection))) {
            return null;
        }

        while (true) {
            iterator.currentPerson++;
            iterator.currentPersonName = iterator.queue[iterator.currentPerson];
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
        if (isCollectionChanged()) {
            iterator.currentPerson = getNewQueue(iterator.currentPersonName,
                iterator.currentPerson);
        };

        if (!iterator.rightStart ||
            iterator.queue.indexOf(iterator.currentPersonName) === -1 ||
            iterator.currentPerson === 0) {
            return null;
        }

        iterator.currentPerson--;
        iterator.currentPersonName = iterator.queue[iterator.currentPerson];
        var answer = {
            name: iterator.queue[iterator.currentPerson],
            phone: collection[iterator.queue[iterator.currentPerson]].phone
        };
        return answer;
    };

    iterator.nextMale = function (name) {
        if (isCollectionChanged()) {
            iterator.currentPerson = getNewQueue(iterator.currentPersonName,
                iterator.currentPerson);
        };

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
        if (isCollectionChanged()) {
            iterator.currentPerson = getNewQueue(iterator.currentPersonName,
                iterator.currentPerson);
        };

        if (!iterator.rightStart || iterator.currentPerson === 0) {
            return null;
        }
        var answer = iterator.prev();
        while (!(answer === null) && !(collection[answer.name].gender === 'Мужской')) {
            answer = iterator.prev();
        };
        return answer;
    };

    // проверяем был ли кто-нибудь удален?
    function isCollectionChanged() {
        if (iterator.collectionLenght === Object.keys(collection).length) {
            return false;
        }
        var keys = Object.keys(collection);
        for (var i = 0; i < iterator.collectionLength; i++) {
            if (keys.indexOf(iterator.queue[i]) === -1) {
                getNewQueue(iterator.queue[i], i);
            }
        }
        return true;
    }

    function getNewQueue(start, currentPersonNumber) {
        var rightStart = currentPersonNumber;
        var keys = Object.keys(collection);
        if (keys.indexOf(start) === -1) {
            rightStart = iterator.parent[currentPersonNumber];
            iterator.queue.splice(currentPersonNumber,
                iterator.collectionLength - currentPersonNumber);
            iterator.parent.splice(currentPersonNumber,
                iterator.collectionLength - currentPersonNumber);
            iterator.currentDepth.splice(currentPersonNumber,
                iterator.collectionLength - currentPersonNumber);
            iterator.collectionLength = iterator.queue.length;
        }

        if (rightStart === null) {
            return null;
        }

        currentPersonNumber = rightStart;
        var currentDepth = iterator.currentDepth[iterator.collectionLength - 1] + 1;
        var pointToChangeDepth = iterator.collectionLength;
        while (currentPersonNumber < iterator.collectionLength) {
            // изменяем, и проверяем глубину
            if (pointToChangeDepth === currentPersonNumber) {
                currentDepth++;
                pointToChangeDepth = iterator.collectionLength;
            }
            // записываем новых друзей в очередь.
            var newPeople = (collection[iterator.queue[currentPersonNumber]].friends).filter(
                function isNewFriend(person) {
                    return (keys.indexOf(person) !== -1 &&
                        iterator.queue.indexOf(person) === -1) &&
                        (person !== startPoint);
                }).sort();
            iterator.queue = iterator.queue.concat(newPeople);
            newPeople.forEach(function (person) {
                iterator.parent = iterator.parent.concat(currentPersonNumber);
                iterator.currentDepth = iterator.currentDepth.concat(currentDepth);
            });
            iterator.collectionLength = iterator.queue.length;
            currentPersonNumber++;
        }
        return iterator.queue.indexOf(start);
    }

    return iterator;
};
