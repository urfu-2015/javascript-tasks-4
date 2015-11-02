'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = collection.length;
    }
    var friends = module.exports.getFriends(collection, startPoint, depth);
    var length = friends.length;
    var index = -1;
    return {
        next: function (name) {
            if (!this.hasNext()) {
                return null;
            }
            ++index;
            var nextFriend = {};
            if (name !== undefined) {
                while (friends[index] !== name) {
                    ++index;
                }
                nextFriend['name'] = name;
                nextFriend['phone'] = collection[name].phone;
                return nextFriend;
            }
            nextFriend['name'] = friends[index];
            nextFriend['phone'] = collection[friends[index]].phone;
            return nextFriend;
        },
        hasNext: function () {
            return index < length - 1;
        },
        prev: function () {
            /*
                Возвращает null у prev на самом первом элементе
            */
            if (!this.hasPrev()) {
                return null;
            }
            --index;
            var prevFriend = {};
            prevFriend['name'] = friends[index];
            prevFriend['phone'] = collection[friends[index]].phone;
            return prevFriend;
        },
        hasPrev: function () {
            return index > 0;
        },
        nextMale: function () {
            if (!this.hasNextMale()) {
                return null;
            }
            ++index;
            for (var i = index; i < friends.length; ++i) {
                if (collection[friends[i]].gender !== 'Мужской') {
                    index++;
                    continue;
                } else {
                    var nextMaleFriend = {};
                    nextMaleFriend['name'] = friends[index];
                    nextMaleFriend['phone'] = collection[friends[index]].phone;
                    return nextMaleFriend;
                }
            }
        },
        hasNextMale: function () {
            for (var i = index + 1; i < friends.length; ++i) {
                if (collection[friends[i]].gender === 'Мужской') {
                    return true;
                }
            }
            return false;
        },
        prevMale: function () {
            if (!this.hasPrevMale()) {
                return null;
            }
            --index;
            for (var i = index; i >= 0; --i) {
                if (collection[friends[index]].gender !== 'Мужской') {
                    --index;
                } else {
                    var prevMaleFriend = {};
                    prevMaleFriend['name'] = friends[index];
                    prevMaleFriend['phone'] = collection[friends[index]].phone;
                    return prevMaleFriend;
                }
            }
        },
        hasPrevMale: function () {
            for (var i = index - 1; i >= 0; --i) {
                if (collection[friends[i]].gender === 'Мужской') {
                    return true;
                }
            }
            return false;
        }
    };
};

module.exports.getFriends = function (collection, startPoint, depth) {
    var friends = [];
    if (collection[startPoint] === undefined || depth === 0) {
        return friends;
    }
    var queue = [];
    var handshakeCircle = [];
    var used = [];
    queue.push(startPoint);
    handshakeCircle[startPoint] = 0;
    used[startPoint] = true;
    while (queue.length !== 0) {
        var friendFromQueue = queue.shift();
        if (handshakeCircle[friendFromQueue] >= depth) {
            break;
        }
        var alphFriends = collection[friendFromQueue].friends.slice().sort();
        alphFriends.forEach(function (friend) {
            if (used[friend] !== true) {
                queue.push(friend);
                used[friend] = true;
                handshakeCircle[friend] = handshakeCircle[friendFromQueue] + 1;
                friends.push(friend);
            }
        });
    }
    return friends;
};
