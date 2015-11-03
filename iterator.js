'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var currentIndex = 0;
    depth = depth || collection.length;
    var friends = getFriends(collection, startPoint, depth);
    var countFriends = friends.length;
    return {
        next: function (name) {
            if (Object.keys(collection).indexOf(startPoint) === -1 ||
                currentIndex >= countFriends) {
                return null;
            }
            while (currentIndex < countFriends - 1) {
                currentIndex += 1;
                var friendName = friends[currentIndex];
                if (friendName === name || typeof name === 'undefined') {
                    var info = collection[friendName];
                    var nextPerson = {
                        name: friendName,
                        phone: info.phone
                    };
                    return nextPerson;
                }
            }
            return null;
        },
        prev: function () {
            if (Object.keys(collection).indexOf(startPoint) === -1 ||
                currentIndex <= 0) {
                return null;
            }
            if (check(friends, collection, startPoint, depth)) {
                currentIndex -= 1;
                if (currentIndex >= 1) {
                    var friendName = friends[currentIndex];
                    var info = collection[friendName];
                    var prevPerson = {
                        name: friendName,
                        phone: info.phone
                    };
                    return prevPerson;
                }
            } else {
                var name = friends[currentIndex];
                friends = updateFriendsList(collection, startPoint, depth);
                countFriends = friends.length;
                var index = friends.indexOf(name);
                if (index !== -1) {
                    currentIndex = index;
                } else {
                    currentIndex = 1;
                }
                return this.prev();
            }
            return null;
        },
        nextMale: function (name) {
            var friend = this.next(name);
            while (friend !== null) {
                if (collection[friend.name].gender === 'Мужской') {
                    return friend;
                }
                var friend = this.next();
            }
            return null;
        },
        prevMale: function () {
            var friend = this.prev();
            while (friend !== null) {
                if (collection[friend.name].gender === 'Мужской') {
                    return friend;
                }
                var friend = this.prev();
            }
            return null;
        }
    };
};

function getFriends(collection, startPoint, depth) {
    var friends = [];
    if (Object.keys(collection).indexOf(startPoint) === -1) {
        return friends;
    }
    var item = {
        name: startPoint,
        countHandshakes: 0
    };
    var queue = [item];
    var addedName = [];
    while (queue.length !== 0) {
        var record = queue.shift();
        if (record.countHandshakes > depth) {
            break;
        }
        if (friends.indexOf(record.name) === -1) {
            friends.push(record.name);
        }
        var allFriends = collection[record.name].friends.sort();
        for (var i = 0; i < allFriends.length; i++) {
            if (addedName.indexOf(allFriends[i]) === -1 &&
                Object.keys(collection).indexOf(allFriends[i]) !== -1) {
                var newRecord = {
                    name: allFriends[i],
                    countHandshakes: record.countHandshakes + 1
                };
                queue.push(newRecord);
                addedName.push(allFriends[i]);
            }
        }
    }
    return friends;
}

function check(friends, collection, startPoint, depth) {
    var listFriends = getFriends(collection, startPoint, depth);
    return friends.length === listFriends.length;
}

function updateFriendsList(collection, startPoint, depth) {
    return getFriends(collection, startPoint, depth);
}
