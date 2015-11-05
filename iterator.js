'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var friends = getFriendsList(collection, startPoint, depth);
    var currentIndex = 1;
    var nextFriend = null;
    var prevFriend = null;
    var friendsLength = friends.length;

    return {
        next: function (friendName, gender) {
            nextFriend = null;
            if (friendName) {
                for (var i = 0; i < friendsLength; i++) {
                    if (friends[i].name === friendName) {
                        nextFriend = {name: friendName,
                                      phone: friends[i].phone};
                        currentIndex = i + 1;
                        break;
                    }
                }
                return nextFriend;
            }
            if (currentIndex < friends.length && currentIndex >= 0) {
                nextFriend = {name: friends[currentIndex].name,
                              phone: friends[currentIndex].phone};
                currentIndex += 1;
            }
            return nextFriend;
        },

        nextMale: function () {
            nextFriend = null;
            if (currentIndex >= 0 && currentIndex < friends.length) {
                for (var i = currentIndex; i < friendsLength; i++) {
                    if (friends[i].gender === 'Мужской') {
                        nextFriend = {name: friends[i].name,
                                      phone: friends[i].phone};
                        currentIndex = i + 1;
                        break;
                    }
                }
            }
            return nextFriend;
        },

        prev: function () {
            prevFriend = null;
            (nextFriend) ? currentIndex -= 2 : currentIndex -= 1;
            if (currentIndex >= 0 && currentIndex < friends.length) {
                prevFriend = {name: friends[currentIndex].name,
                              phone: friends[currentIndex].phone};
            }
            currentIndex += 1;
            return prevFriend;
        },

        prevMale: function () {
            prevFriend = null;
            var prevIndex = currentIndex;
            (nextFriend) ? currentIndex -= 2 : currentIndex -= 1;
            for (var i = currentIndex; i >= 0; i--) {
                if (friends[i].gender === 'Мужской') {
                    prevFriend = {name: friends[i].name,
                                  phone: friends[i].phone};
                    currentIndex = (nextFriend) ? i + 1 : i;
                    break;
                }
            }
            return prevFriend;
        }
    };
};


function getFriendsList(collection, startPoint, depth) {
    depth = depth === 0 ? 0 : depth || Infinity;
    var friends = [];
    var visited = [];
    var depthLevel = 0;
    if (!collection[startPoint]) {
        return friends;
    }
    friends.push({name: startPoint,
                  phone: collection[startPoint].phone,
                  gender: collection[startPoint].gender});

    var currentFriends = collection[startPoint].friends.sort();
    var added = [startPoint];

    function dfs(startPoint) {
        depthLevel += 1;
        if (depthLevel < depth) {
            visited.push(startPoint);
            currentFriends = currentFriends.concat(collection[startPoint].friends.sort());
            currentFriends.forEach(function (friend) {
                if (added.indexOf(friend) === -1) {
                    friends.push({name: friend,
                                  phone: collection[friend].phone,
                                  gender: collection[friend].gender});
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
