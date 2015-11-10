'use strict';

function bfs(collection, startPoint, depth) {
    var queue = [{name: startPoint, person: collection[startPoint], depth: 0}];
    var dict = {};
    var friendList = [];
    while (queue.length > 0) {
        var current = queue.shift();
        dict[current.name] = 1;
        friendList.push(current);
        if (current.depth === depth) {
            continue;
        }
        if (!current.person.friends) {
            continue;
        }
        current.person.friends = current.person.friends.sort();
        for (var i = 0; i < current.person.friends.length; i++) {
            var newMemberName = current.person.friends[i];
            if (dict[newMemberName] === undefined) {
                queue.push({name: newMemberName,
                    person: collection[newMemberName], depth: current.depth + 1});
                dict[newMemberName] = 1;
            }
        }
    }
    return friendList;
}

module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = Infinity;
    }
    var friendList = [];
    if (collection[startPoint] !== undefined) {
        friendList = bfs(collection, startPoint, depth);
    }
    var index = 0;
    return {
        next: function () {
            if (arguments[0] !== undefined) {
                var inList = false;
                for (var i = 0; i < friendList.length; i++) {
                    if (friendList[i].name === arguments[0]) {
                        index = i - 1;
                        inList = true;
                    }
                }
                if (!inList) {
                    return null;
                }
            }
            return index + 1 < friendList.length ?
            { name: friendList[1 + index++].name,
                phone: friendList[index].person.phone} : null;
        },
        nextMale: function () {
            while (index + 1 < friendList.length) {
                if (friendList[1 + index++].person.gender === 'Мужской') {
                    return { name: friendList[index].name,
                        phone: friendList[index].person.phone};
                }
            }
            return null;
        },
        prevMale: function () {
            while (index > 0) {
                if (friendList[index-- - 1].person.gender === 'Мужской') {
                    return { name: friendList[index].name,
                        phone: friendList[index].person.phone};
                }
            }
            return null;
        },
        prev: function () {
            return index > 0 ?
            { name: friendList[index-- - 1].name,
                phone: friendList[index].person.phone} : null;
        }
    };
};
