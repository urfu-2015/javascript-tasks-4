'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var friends = getFriendsList(collection, startPoint, depth);
    var currentIndex = 0;
    var friendsLength = friends.length;

    return {
        next: function (friendName, gender) {
            var nextFriend = null;
            if (friendName) {
                for (var i = 0; i < friendsLength; i++) {
                    if (friends[i].name === friendName) {
                        nextFriend = {name: friendName, phone: friends[i].phone};
                        currentIndex = i + 1;
                        break;
                    }
                }
                return nextFriend;
            }
            if (friends.length > currentIndex) {
                nextFriend = {name: friends[currentIndex].name, phone: friends[currentIndex].phone};
                currentIndex += 1;
            }
            return nextFriend;
        },

        nextMale: function () {
            var nextFriend = null;
            for (var i = currentIndex; i < friendsLength; i++) {
                if (friends[i].gender === 'Мужской') {
                    nextFriend = {name: friends[i].name, phone: friends[i].phone};
                    currentIndex = i + 1;
                    break;
                }
            }
            return nextFriend;
        },

        prev: function () {
            var prevFriend = null;
            currentIndex -= 2;
            if (currentIndex >= 0 && currentIndex < friends.length) {
                prevFriend = {name: friends[currentIndex].name, phone: friends[currentIndex].phone};
            }
            currentIndex += 1;
            return prevFriend;
        },

        prevMale: function () {
            var prevFriend = null;
            currentIndex -= 2;
            for (var i = currentIndex; i >= 0; i--) {
                if (friends[i].gender === 'Мужской') {
                    prevFriend = {name: friends[i].name, phone: friends[i].phone};
                    currentIndex = i + 1;
                    break;
                }
            }
            return prevFriend;
        }

    };
};


function getFriendsList(collection, startPoint, depth) {
    if (depth === 0 ){
        return null;
    }
    depth = depth || Object.keys(collection).length;
    var friends = [];
    var visited = [];
    var depthLevel = 0;
    if (!collection[startPoint]) {
        return friends;
    }
    var currentFriends = collection[startPoint].friends.sort();
    var added = [startPoint];
    function dfs(startPoint) {
        visited.push(startPoint);
        currentFriends = currentFriends.concat(collection[startPoint].friends.sort());
        currentFriends.forEach(function (friend) {
            if (added.indexOf(friend) === -1) {
                friends.push({name: friend, phone: collection[friend].phone,
                    gender: collection[friend].gender});
                added.push(friend);
            }
        });
        depthLevel += 1;
        if (depthLevel < depth) {
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
