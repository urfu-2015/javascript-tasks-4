'use strict';
var MAXIMAL_DEPTH = 20;
module.exports.get = function (collection, nameStart, maxDepth) {
    var currentIndexFriend = 0;
    if (maxDepth === undefined) {
        maxDepth = MAXIMAL_DEPTH;
    }
    var friends = collection[nameStart] && initFriends(collection, nameStart, maxDepth);
    return {
        next: function () {
            if (!friends) {
                return null;
            }
            var resultObject;
            if (!arguments[0]) {
                ++currentIndexFriend;
                if (currentIndexFriend >= friends.length) {
                    --currentIndexFriend;
                    return null;
                }
                return {
                    name: friends[currentIndexFriend].name,
                    phone: collection[friends[currentIndexFriend].name].phone
                };
            } else {
                var newIndex = -1;
                for (var i = 0; i < friends.length; i++) {
                    if (friends[i].name === arguments[0]) {
                        newIndex = i;
                    }
                }
                if (newIndex == -1) {
                    return null;
                } else {
                    currentIndexFriend = newIndex;
                    return {
                        name: friends[currentIndexFriend].name,
                        phone: collection[friends[currentIndexFriend].name].phone
                    };
                }
            }
        },

        prev: function () {
            if (!friends) {
                return null;
            }
            var resultObject;
            if (!arguments[0]) {
                --currentIndexFriend;
                if (currentIndexFriend <= 0) {
                    ++currentIndexFriend;
                    return null;
                }
                return {
                    name: friends[currentIndexFriend].name,
                    phone: collection[friends[currentIndexFriend].name].phone
                };
                return resultObject;
            } else {
                var newIndex = -1;
                for (var i = 0; i < friends.length; i++) {
                    if (friends[i].name === arguments[0]) {
                        newIndex = i;
                    }
                }
                if (newIndex == -1) {
                    return null;
                } else {
                    currentIndexFriend = newIndex;
                    return {
                        name: friends[currentIndexFriend].name,
                        phone: collection[friends[currentIndexFriend].name].phone
                    };
                }
            }
        },

        nextMale: function () {
            if (!friends) {
                return null;
            }
            for (var i = currentIndexFriend + 1; i < friends.length; i++) {
                if (collection[friends[i].name].gender === 'Мужской') {
                    currentIndexFriend = i;
                    return {
                        name: friends[currentIndexFriend].name,
                        phone: collection[friends[currentIndexFriend].name].phone
                    };
                }
            }
            return null;
        },

        prevMale: function () {
            if (!friends) {
                return null;
            }
            for (var i = currentIndexFriend - 1; i > 0; i--) {
                if (collection[friends[i].name].gender === 'Мужской') {
                    currentIndexFriend = i;
                    return {
                        name: friends[currentIndexFriend].name,
                        phone: collection[friends[currentIndexFriend].name].phone
                    };
                }
            }
            return null;
        }
    };
};
function initFriends(collection, nameStart, maxDepth) {
    var result = [];
    var queue = [];
    var friends = [];
    var usedNames = {};
    usedNames[nameStart] = true;
    queue.push({name: nameStart, dist: 0});
    result.push({name: nameStart, dist: 0});
    while (queue.length > 0) {
        var nowFriend = queue.shift();
        var friends = [];
        friends = collection[nowFriend.name].friends.sort();
        for (var i = 0; i < friends.length; i++) {
            if (nowFriend.dist + 1 > maxDepth) {
                usedNames[friends[i]] = true;
            } else {
                if (!usedNames[friends[i]]) {
                    var nowFriendObject = {name: friends[i], dist: nowFriend.dist + 1};
                    result.push(nowFriendObject);
                    queue.push(nowFriendObject);
                    usedNames[nowFriendObject.name] = true;
                }
            }
        }
    }
    return result;
}
