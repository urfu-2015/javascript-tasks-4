'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = collection.length;
    } else if (depth < 0) {
        console.error('Неверное значение аргумента!');
        return;
    }
    if (collection[startPoint] === undefined) {
        return {
            next: null,
            prev: null
        };
    }
    var friends = lookForFriends(collection, startPoint, depth);
    var length = friends.length;
    var index = 0;
    return {
        next: function () {
            if (index === length) {
                return null;
            }
            if (name !== undefined) {
                while (true) {
                    var nFriend = friends[index];
                    if (index >= length - 1) {
                        return null;
                    }
                    if (nFriend.name === name) {
                        index++;
                        var nextFriend = {};
                        nextFriend['name'] = nFriend.name;
                        nextFriend['phone'] = nFriend.phone;
                        return nextFriend;
                    }
                    index++;
                }
            } else {
                var nFriend = friends[index];
                var nextFriend = {};
                nextFriend['name'] = nFriend.name;
                nextFriend['phone'] = nFriend.phone;
                index++;
                return nextFriend;
            }
        },
        prev: function () {
            if (index <= 1) {
                return null;
            }
            index--;
            var pFriend = friends[index];
            var prevFriend = {};
            prevFriend['name'] = pFriend.name;
            prevFriend['phone'] = pFriend.phone;
            return prevFriend;
        },
        nextMale: function () {
            if (index === length) {
                return null;
            }
            while(true) {
                var nMaleFriend = friends[index];
                if (nMaleFriend.gende === 'Мужской') {
                    index++;
                    var nextMaleFriend = {};
                    nextMaleFriend['name'] = nMaleFriend.name;
                    nextMaleFriend['phone'] = nMaleFriend.phone;
                    return nextMaleFriend;
                }
                index++;
            }
        },
        prevMale: function () {
            if (index <= 1) {
                return null;
            }
            index--;
            while (true) {
                var pMaleFriend = friends[index];
                if (pMaleFriend.gender === 'Мужской') {
                    index--;
                    var prevMaleFriend = {};
                    prevMaleFriend['name'] = pMaleFriend.name;
                    prevMaleFriend['phone'] = pMaleFriend.phone;
                }
                index--;
            }
        }
    };
};

function lookForFriends(collection, startPoint, depth) {
    var friends = [];
    if (collection[startPoint] === undefined || depth === 0) {
        return friends;
    }
    var queue = [[startPoint, 0]],
        friendDepth = [],
        friendFriends = [];
    friendDepth[startPoint] = 0;
    friendFriends[startPoint] = true;
    while (queue.length > 0 && friendDepth < depth) {
        var nowFriend = queue.shift();
        var friendsOfNowFriend = collection[nowFriend].friends.sort();
        friendsOfNowFriend.forEach(function(friend) {
            if (friendFriends[friend] !== true) {
                queue.push(friend);
                friendFriends[friend] = true;
                friendDepth[friend] = friendDepth[nowFriend] + 1;
                friends.push(friend);
            }
        })
    }    
    return friends;
};
