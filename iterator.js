'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = Infinity;
    }
    if (collection[startPoint] == undefined) {
        return {
            friends: collection,
            next: getNull,
            prev: getNull,
            nextMale: getNull,
            prevMale: getNull
        };
    }
    var queue = [];
    var start = [startPoint, collection[startPoint], 0];
    queue.push(start);
    var friends = getFriends(collection, queue, depth);
    var index = 0;
    return {
        friends: friends,
        next: function () {
            if (index >= friends.length || isUncorrectArg(arguments[0], friends, startPoint)) {
                return null;
            }
            var current = friends[index];
            friends = getFriends(collection, [start], depth);
            index = getIndexByName(friends, current[0], index) + 1;
            index = getIndexByName(friends, arguments[0], index);
            return index < friends.length ?
                {
                    name: friends[index][0],
                    phone: friends[index][1]['phone']
                } : null;
        },

        prev: function () {
            if (index <= 0 || isUncorrectArg(arguments[0], friends, startPoint)) {
                return null;
            }
            var current = friends[index];
            friends = getFriends(collection, [start], depth);
            index = getIndexByName(friends, current[0], index) - 1;
            index = getIndexByName(friends, arguments[0], index);
            return index > -1 && index < friends.length ?
                {
                    name: friends[index][0],
                    phone: friends[index][1].phone
                } : null;
        },

        nextMale: function () {
            var friend = this.next();
            if (!friend) {
                return null;
            }
            friend = getMale(friends, index, friend);
            return friend ? friend : this.nextMale();
        },

        prevMale: function () {
            var friend = this.prev();
            if (!friend) {
                return null;
            }
            friend = getMale(friends, index, friend);
            return friend ? friend : this.prevMale();
        }
    };
};

function getFriends(collection, queue, depth) {
    var count = 0;
    var numOfFriend = 0;
    while (numOfFriend < queue.length) {
        var friend = queue[numOfFriend];
        numOfFriend++;
        var friendsS = friend[1]['friends'];
        count = friend[2] + 1;
        if (count > depth) {
            break;
        }
        friendsS.sort();
        for (var i = 0; i < friendsS.length; i++) {
            var name = friendsS[i];
            if (!isInList(queue, name) && collection[name]) {
                queue.push([name, collection[name], count]);
            }
        };
    };
    return queue;
};

function isInList(list, user) {
    for (var i = 0; i < list.length; i++) {
        if (list[i][0] == user) {
            return true;
        }
    };
    return false;
};

function getNull() {
    return null;
};

function getIndexByName(queue, name, index) {
    if (!name) {
        return index;
    }
    for (var j = 0; j < queue.length; j++) {
        if (queue[j][0] == name) {
            return j;
        }
    };
    return null;
};

function getMale(friends, index, friend) {
    return friends[index][1]['gender'] == 'Мужской' ?
        friend : null;
};

function isUncorrectArg(arg, friends, startPoint) {
    if (arg) {
        return !isInList(friends, arg) || startPoint == arg;
    }
    return false;
}
