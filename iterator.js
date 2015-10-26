'use strict';

module.exports.get = function (collection, startPoint, depth) {
    return new Iterator(collection, startPoint, depth);
};

function Iterator(collection, startPoint, depth) {
    if (depth === undefined || depth > collection.length) {
        depth = Object.keys(collection).length;
    }
    var friends = getFriends(collection, startPoint, depth);
    var currentPerson = startPoint;
    var index = -1;
    var friendsCount;
    if (friends) {
        friendsCount = friends.length;
    } else {
        friendsCount = 0;
    }
    this.next = function (name) {
        if (name === undefined) {
            if (currentPerson === undefined || index === friendsCount - 1) {
                return null;
            }
            index++;
            currentPerson = friends[index].name;
            return friends[index];
        }
        if (collection[name] === undefined || index === friendsCount - 1) {
            return null;
        }
        index++;
        while (friends[index].name !== name && index < friendsCount) {
            index++;
        }
        if (index === friendsCount - 1) {
            return null;
        }
        currentPerson = friends[index].name;
        return friends[index];
    };
    this.prev = function (name) {
        if (name === undefined) {
            if (currentPerson === undefined || index <= 0) {
                return null;
            }
            index--;
            currentPerson = friends[index].name;
            return friends[index];
        }
        if (collection[name] === undefined || index === 0) {
            return null;
        }
        index--;
        while (friends[index].name !== name && index !== 0) {
            index--;
        }
        if (index === 0) {
            return null;
        }
        currentPerson = friends[index].name;
        return friends[index];
    };
    this.nextMale = function () {
        var friend = this.next();
        while (friend !== null && collection[friend.name].gender !== 'Мужской') {
            friend = this.next();
        }
        return friend;
    };
    this.prevMale = function () {
        var friend = this.prev();
        while (friend !== null && collection[friend.name].gender !== 'Мужской') {
            friend = this.next();
        }
        return friend;
    };
}

function getFriends(collection, startPoint, depth) {
    var people = [];
    if (collection[startPoint] === undefined || depth < 1) {
        return null;
    }
    var queue = [];
    queue.push(startPoint);
    var used = [];
    used[startPoint] = true;
    while (depth > 0 && queue.length > 0) {
        depth--;
        var v = queue.shift();
        var friends = collection[v].friends.sort();
        for (var i = 0; i < friends.length; i++) {
            var to = friends[i];
            if (!used[to]) {
                used[to] = true;
                people.push({
                    name: to,
                    phone: collection[to].phone,
                });
                queue.push(to);
            }
        }
    }
    return people;
}
