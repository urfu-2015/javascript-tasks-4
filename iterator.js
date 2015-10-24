'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (collection[startPoint]) {
        var currentList = collection[startPoint].friends;
    }
    var currentPersonId = -1;
    var previousPersons = [startPoint];
    if (typeof depth === 'undefined') {
        depth = Number.MAX_VALUE;
    }
    var collectionLength = Object.keys(collection).length;
    return {
        next: function (targetPerson) {
            return this.hiddenNext(false, targetPerson);
        },
        nextMale: function () {
            return this.hiddenNext(true);
        },
        prev: function () {
            return this.hiddenPrev(false);
        },
        prevMale: function () {
            this.hiddenPrev(true);
        },
        hiddenNext: function (parameter, targetPerson) {
            if (!collection[startPoint]) {
                // console.log('null');
                return null;
            }
            currentPersonId++;
            while (currentPersonId <= currentList.length) {
                if (currentPersonId == currentList.length) {
                    var name = findNextName(collection, previousPersons, depth);
                    if (name == null) {
                        // console.log('null');
                        return null;
                    }
                    currentPersonId = 0;
                    currentList = collection[name].friends;
                }
                var friendName = currentList[currentPersonId];
                var previouslyUnused = true;
                for (var i = 0; i < previousPersons.length - 1; i++) {
                    var tempList = collection[previousPersons[i]].friends;
                    if (tempList.indexOf(friendName) != -1) {
                        previouslyUnused = false;
                    }
                };
                if (!previouslyUnused) {
                    currentPersonId++;
                    continue;
                }
                if (previousPersons.indexOf(friendName) != -1) {
                    currentPersonId++;
                    continue;
                }
                if (parameter && collection[friendName].gender != 'Мужской') {
                    currentPersonId++;
                    continue;
                }
                if (targetPerson && friendName != targetPerson) {
                    currentPersonId++;
                    continue;
                }
                console.log(friendName);
                return Object(collection[friendName]);
            };
            // console.log('null');
            return null;
        },
        hiddenPrev: function (parameter) {
            collectionLength = сhangesInCollection(collection,
             collectionLength, previousPersons);
            if (!collection[startPoint]) {
                // console.log('null');
                return null;
            }
            currentPersonId--;
            while (currentPersonId >= -1) {
                if (currentPersonId == -1) {
                    previousPersons.pop();
                    var name = previousPersons[previousPersons.length - 1];
                    if (name == null) {
                        // console.log('null');
                        return null;
                    }
                    currentList = collection[name].friends;
                    currentPersonId = currentList.length - 1;
                }
                var friendName = currentList[currentPersonId];
                if (previousPersons.indexOf(friendName) != -1) {
                    currentPersonId--;
                    continue;
                }
                if (parameter && collection[friendName].gender != 'Мужской') {
                    currentPersonId--;
                    continue;
                }
                console.log(friendName);
                return Object(collection[friendName]);
            };
            // console.log('null');
            return null;
        }
    };
};


function findNextName(collection, previousPersons, MaxDepth) {
    // BFS
    var used = [previousPersons[0]];
    var queue = [previousPersons[0]];
    var depth = [0];
    while (queue.length > 0) {
        var person = queue.shift();
        var parentDepth = depth.splice(0, 1)[0];
        if (previousPersons.indexOf(person) == -1) {
            previousPersons.push(person);
            return person;
        }
        var friends = collection[person].friends;
        for (var i = 0; i < friends.length; i++) {
            var currentDepth = parentDepth + 1;
            if (used.indexOf(friends[i]) == -1 &&
                currentDepth < MaxDepth) {
                queue.push(friends[i]);
                depth.push(currentDepth);
                used.push(friends[i]);
            };
        };
    };
    return null;
}

function сhangesInCollection(collection, collectionLength, previousPersons) {
    var newCollectionLength = Object.keys(collection).length;
    if (collectionLength == newCollectionLength) {
        return newCollectionLength;
    }
    var remoteName;
    for (var i = 0; i < previousPersons.length; i++) {
        var remoteName = previousPersons[i];
        if (!collection[remoteName]) {
            var index = previousPersons.indexOf(remoteName);
            previousPersons.splice(index, 1);
        }
    }
    for (var e in collection) {
        for (var i = 0; i < collection[e].friends.length; i++) {
            if (collection[e].friends[i] == remoteName) {
                collection[e].friends.splice(i, 1);
            }
        };
    }
    return newCollectionLength;
}
