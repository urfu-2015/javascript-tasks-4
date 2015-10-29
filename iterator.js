'use strict';

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = Infinity;
    };
    if (collection[startPoint] == undefined) {
        return {
            friends: collection,
            next: getNull,
            prev: getNull,
            nextMale: getNull,
            prevMale: getNull
        };
    };
    var queue = [];
    var start = [startPoint, collection[startPoint], 0];
    queue.push(start);
    var friends = getFriends(collection, queue, depth);
    var index = 0;
    return {
        friends: friends,
        next: function () {
            var current = friends[index];
            friends = getFriends(collection, [start], depth);
            index = getIndex(friends, [current], index, false);
            index++;
            index = getIndex(friends, arguments, index, true);
            return index < friends.length ?
                {
                    friend: friends[index][0],
                    phone: friends[index][1]['phone']
                } : null;
        },
        prev: function () {
            var current = friends[index];
            friends = getFriends(collection, [start], depth);
            index = getIndex(friends, [current], index, false);
            index--;
            index = getIndex(friends, arguments, index, true);
            return index > -1 ?
                {
                    friend: friends[index][0],
                    phone: friends[index][1]['phone']
                } : null;
        },
        nextMale: function () {
            var current = friends[index];
            friends = getFriends(collection, [start], depth);
            index = getIndex(friends, [current], index, false);
            index = getIndex(friends, arguments, index, true);
            var nexts = null;
            while (!nexts && index < friends.length - 1) {
                index++;
                nexts = getMale(friends, index);
            };
            return nexts;
        },
        prevMale: function () {
            var current = friends[index];
            friends = getFriends(collection, [start], depth);
            index = getIndex(friends, [current], index, false);
            index = getIndex(friends, arguments, index, true);
            var prevs = null;
            while (!prevs && index > 0) {
                index--;
                prevs = getMale(friends, index);
            };
            return prevs;
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
        };
        for (var i = 0; i < friendsS.length; i++) {
            var name = friendsS[i];
            if (!isInList(queue, name) && collection[name]) {
                queue.push([name, collection[name], count]);
            };
        };
    };
    return queue;
};

function isInList(queue, user) {
    for (var i = 0; i < queue.length; i++) {
        if (queue[i][0] == user) {
            return true;
        };
    };
    return false;
};

function getNull() {
    return null;
};

function getIndex(queue, names, index, isName) {
    for (var i = 0; i < names.length; i++) {
        for (var j = 0; j < queue.length; j++) {
            if ((isName && queue[j][0] == names[i]) || (!isName && queue[j][0] == names[i][0])) {
                return j;
            };
        };
    };
    return index;
}

function getMale(friends, index) {
    return friends[index][1]['gender'] == 'Мужской' ?
        {
            friend: friends[index][0],
            phone: friends[index][1]['phone']
        } : null;
}
