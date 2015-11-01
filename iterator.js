'use strict';

module.exports.get = function (collection, startPoint, depth) {
    return new Iterator(collection, startPoint, depth);
};

function Iterator(collection, startPoint, depth) {
    if (depth === undefined || depth > collection.length) {
        depth = Object.keys(collection).length;
    }
    if (depth < 0) {
        depth = 1;
    }
    var myCollection = collection;
    var startPerson = startPoint;
    var friendsDepth = depth;
    var friends = getFriends(collection, startPoint, depth);
    var currentPerson = startPoint;
    var index = -1;
    var friendsCount;
    if (friends) {
        friendsCount = friends.length;
    } else {
        friendsCount = 0;
    }
    this._nextByName = function (name) {
        if (name === undefined || collection[name] === undefined || index === friendsCount - 1) {
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

    this._nextByOrder = function () {
        if (currentPerson === undefined || index === friendsCount - 1) {
            return null;
        }
        index++;
        currentPerson = friends[index].name;
        return friends[index];
    };

    this.next = function (name) {
        this._updateFriends();
        if (name === undefined) {
            return this._nextByOrder();
        }
        return this._nextByName(name);
    };

    this._prevByName = function (name) {
        if (name === undefined || collection[name] === undefined || index === 0) {
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

    this._prevByOrder = function () {
        if (currentPerson === undefined || index <= 0) {
            return null;
        }
        index--;
        currentPerson = friends[index].name;
        return friends[index];
    };

    this.prev = function (name) {
        this._updateFriends();
        if (name === undefined) {
            return this._prevByOrder();
        }
        return this._prevByName(name);
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
            friend = this.prev();
        }
        return friend;
    };

    this._updateFriends = function () {
        friends = getFriends(myCollection, startPerson, friendsDepth);
        friendsCount = friends.length;
        if (friends.length === 0) {
            throw new Error('Start person deleted');
        }
        var currentFriendIndex = -1;
        for (var i = 0; i < friends.length; i++) {
            if (friends[i].name === currentPerson) {
                currentFriendIndex = i;
            }
        }
        if (currentFriendIndex < 0 && currentPerson !== startPerson) {
            throw new Error('Current person deleted');
        }
        index = currentFriendIndex;
    };
}

function getFriends(collection, startPoint, depth) {
    var people = [];
    if (collection[startPoint] === undefined || depth < 1) {
        return [];
    }
    var queue = [startPoint];
    var used = [];
    used[startPoint] = true;
    var myCollection = clone(collection);
    while (depth > 0 && queue.length > 0) {
        depth--;
        var v = queue.shift();
        var friends = myCollection[v].friends.sort();
        for (var i = 0; i < friends.length; i++) {
            var to = friends[i];
            if (used[to] || myCollection[to] === undefined) {
                continue;
            }
            used[to] = true;
            people.push({
                name: to,
                phone: myCollection[to].phone
            });
            queue.push(to);
        }
    }
    return people;
}

function clone(obj) {
    if (obj == null || typeof (obj) != 'object') {
        return obj;
    }
    var temp = new obj.constructor();
    for (var key in obj) {
        temp[key] = clone(obj[key]);
    }
    return temp;
}
