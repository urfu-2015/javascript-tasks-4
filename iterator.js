'use strict';

function getFriends(collection, startPoint, depth) {
    depth = depth === 0 ? 0 : depth || Infinity;
    var friends = [];
    var visited = [];
    var depthLevel = 0;
    if (!collection[startPoint]) {
        return friends;
    }
    friends.push({
        name: startPoint,
        phone: collection[startPoint].phone,
        gender: collection[startPoint].gender
    });

    var currentFriends = collection[startPoint].friends.sort();
    var added = [startPoint];

    function dfs(startPoint) {
        depthLevel++;
        if (depthLevel < depth) {
            visited.push(startPoint);
            currentFriends = currentFriends.concat(collection[startPoint].friends.sort());
            currentFriends.forEach(function (friend) {
                if (added.indexOf(friend) === -1) {
                    friends.push({
                        name: friend,
                        phone: collection[friend].phone,
                        gender: collection[friend].gender
                    });
                    added.push(friend);
                }
            });
            currentFriends.forEach(function (friend) {
                if (visited.indexOf(friend) === -1) {
                    dfs(friend);
                }
            });
        }
    }
    dfs(startPoint);
    return friends;
}

module.exports.get = function (collection, startPoint, depth) {
    var friends = getFriends(collection, startPoint, depth);
    var currentIndex = 1;
    var nextFriend = null;
    var prevFriend = null;
    var friendsLength = friends.length;

    return {
        next: function (friendName) {
            nextFriend = null;
            if (friendName) {
                for (var index = 1; index < friendsLength; index++) {
                    if (friends[index].name === friendName) {
                        nextFriend = {
                            name: friendName,
                            phone: friends[index].phone
                        };
                        currentIndex = ++index;
                        break;
                    }
                }
                return nextFriend;
            }
            if (0 < currentIndex && currentIndex < friends.length) {
                nextFriend = {
                    name: friends[currentIndex].name,
                    phone: friends[currentIndex].phone
                };
                currentIndex++;
            }
            return nextFriend;
        },

        nextMale: function () {
            nextFriend = null;
            if (0 < currentIndex && currentIndex < friends.length) {
                for (var index = currentIndex; index < friendsLength; index++) {
                    if (friends[index].gender === 'Мужской') {
                        nextFriend = {
                            name: friends[index].name,
                            phone: friends[index].phone
                        };
                        currentIndex = ++index;
                        break;
                    }
                }
            }
            return nextFriend;
        },

        prev: function () {
            prevFriend = null;
            (nextFriend) ? currentIndex -= 2 : currentIndex--;
            if (0 < currentIndex && currentIndex < friends.length) {
                prevFriend = {
                    name: friends[currentIndex].name,
                    phone: friends[currentIndex].phone
                };
            }
            currentIndex++;
            return prevFriend;
        },

        prevMale: function () {
            prevFriend = null;
            (nextFriend) ? currentIndex -= 2 : currentIndex--;
            for (var index = currentIndex; index >= 0; index--) {
                if (friends[index].gender === 'Мужской') {
                    prevFriend = {
                        name: friends[index].name,
                        phone: friends[index].phone
                    };
                    currentIndex = (nextFriend) ? index++ : index;
                    break;
                }
            }
            return prevFriend;
        }
    };
};
