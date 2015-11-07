'use strict';
var MAXIMAL_DEPTH = 20;
module.exports.get = function (collection, nameStart, maxDepth) {
    var currentIndexFriend = 0;
    if (maxDepth === undefined) {
        maxDepth = MAXIMAL_DEPTH;
    }
    var friends = collection[nameStart] && initFriends(collection, nameStart, maxDepth);
    return {
        currentFriend: function (currentIndexFriend, CorrectIndex) {
            if (CorrectIndex === -1) {
                return null;
            } else {
                currentIndexFriend = CorrectIndex;
                return {
                    name: friends[currentIndexFriend].name,
                    phone: collection[friends[currentIndexFriend].name].phone,
                    friends: collection[friends[currentIndexFriend].name].friends,
                    gender: collection[friends[currentIndexFriend].name].gender
                };
            }
        },
        next: function () {
            if (!friends) {
                return null;
            }
            if (!arguments[0]) {
                ++currentIndexFriend;
                var CorrectIndex = currentIndexFriend;
                if (currentIndexFriend >= friends.length) {
                    --currentIndexFriend;
                    CorrectIndex = -1;
                }
                return this.currentFriend(currentIndexFriend, CorrectIndex);
            } else {
                var newIndex = -1;
                for (var i = 0; i < friends.length; i++) {
                    if (friends[i].name === arguments[0]) {
                        newIndex = i;
                    }
                }
                return this.currentFriend(currentIndexFriend, newIndex);
            }
        },

        prev: function () {
            if (!friends) {
                return null;
            }
            if (!arguments[0]) {
                --currentIndexFriend;
                var CorrectIndex = currentIndexFriend;
                if (currentIndexFriend <= 0) {
                    ++currentIndexFriend;
                    CorrectIndex = -1;
                }
                return this.currentFriend(currentIndexFriend, CorrectIndex);
            } else {
                var newIndex = -1;
                for (var i = 0; i < friends.length; i++) {
                    if (friends[i].name === arguments[0]) {
                        newIndex = i;
                    }
                }
                return this.currentFriend(currentIndexFriend, newIndex);
            }
        },

        nextMale: function () {
            if (!friends) {
                return null;
            }
            for (var i = currentIndexFriend + 1; i < friends.length; i++) {
                if (collection[friends[i].name].gender === 'Мужской') {
                    return this.currentFriend(currentIndexFriend, i);
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
                    return this.currentFriend(currentIndexFriend, i);
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
