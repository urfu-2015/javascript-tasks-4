'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var index = -1;
    var friends = createStack(collection, startPoint, depth);
    var collections_length = Object.keys(collection).length;
    var selectName;

    function checkCollectionIntegrity() {
        if (collections_length > Object.keys(collection).length) {
            collections_length = Object.keys(collection).length;
            friends = createStack(collection, startPoint, depth);
            index = friends.indexOf(selectName);
        }
    }

    return {
        next: function (name) {
            checkCollectionIntegrity();
            if (name != undefined && 
                (friends.indexOf(name) < 0 || 
                Object.keys(collection).indexOf(name) < 0)) {
                return null;
            }
            if (!friends) {
                return null;
            }
            index = name != undefined ? friends.indexOf(name) : index + 1;
            selectName = friends[index];
            return index < friends.length ? {
                name: friends[index],
                phone: collection[friends[index]].phone
            } : null;
        },

        nextMale: function () {
            checkCollectionIntegrity();
            var isFind = true;

            if (++index >= friends.length) {
                isFind = false;
            } else {
                while (collection[friends[index]].gender != 'Мужской' && isFind) {
                    index++;
                    if (index == friends.length) {
                        isFind = false;
                    }
                }
            }
            selectName = friends[index];
            return isFind ? {
                name: friends[index],
                phone: collection[friends[index]].phone
            } : null;
        },

        prev: function () {
            checkCollectionIntegrity();
            if (!friends) {
                return null;
            }
            return index > 0 ? {
                name: friends[--index],
                phone: collection[friends[index]].phone
            } : null;
        },

        prevMale: function () {
            checkCollectionIntegrity();

            var isFind = true;

            if (--index < 0) {
                isFind = false;
            } else {
                while (collection[friends[index]].gender != 'Мужской' && isFind) {
                    index--;
                    if (index < 0) {
                        isFind = false;
                    }
                }
            }
            selectName = friends[index];
            return isFind ? {
                name: friends[index],
                phone: collection[friends[index]].phone
            } : null;
        }
    };
};

function createStack(collection, startPoint, d) {
    if (!(startPoint in collection)) {
        return null;
    }

    var iterated_friends = [];
    iterated_friends.push(startPoint);
    var friends = [];

    function iterateFriends(depth, friends, iterated_friends) {
        var count = 0;
        if (depth == d) {
            return;
        }
        var current_friends = [];

        for (var friend of iterated_friends) {
            for (var k of collection[friend].friends) {
                if (Object.keys(collection).indexOf(k) > 0 &&
                    friends.indexOf(k) < 0 &&
                    k != startPoint) {
                    count++;
                    friends.push(k);
                    current_friends.push(k);
                }
            }
        }

        if (count == 0) {
            return;
        }
        iterateFriends(depth + 1, friends, current_friends);
    }

    iterateFriends(0, friends, iterated_friends);
    return friends;
}


