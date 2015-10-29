'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var index = 0;
    var data = getInvitedFriends(collection, startPoint, depth);
    var length = data.length;
    var currentName = startPoint;
    return {
        next: function (name) {
            if (collection[startPoint] === undefined) {
                return null;
            }
            this.checkChanges();
            var element;
            if (!this.hasNext() || !this.hasName(name) || startPoint === undefined ||
                collection[startPoint] === undefined) {
                return null;
            }
            while (this.hasNext()) {
                element = data[index];
                if (element.name === name || name === undefined) {
                    index += 1;
                    currentName = element.name;
                    var res = {
                        name: element.name,
                        phone: element.contactInfo.phone
                    };
                    return res;
                }
                index += 1;
                currentName = element.name;
            }
            return null;
        },
        prev: function () {
            this.checkChanges();
            var element;
            if (!this.hasPrev() || startPoint === undefined) {
                return null;
            }
            element = data[index - 2];
            currentName = element.name;
            index -= 1;
            var res = {
                name: element.name,
                phone: element.contactInfo.phone
            };
            return res;
        },
        hasName: function (name) {
            if (name != undefined) {
                return data.some(contact => contact.name === name);
            }
            return true;
        },
        hasNext: function () {
            return index < length;
        },
        hasPrev: function () {
            return index > 1;
        },
        nextMale: function () {
            return this.getMale(1, 0, this.hasNext);
        },
        prevMale: function () {
            return this.getMale(-1, 2, this.hasPrev);
        },
        getMale: function (direction, step, func) {
            var element;
            this.checkChanges();
            while (func()) {
                element = data[index - step];
                if (element.contactInfo.gender === 'Мужской') {
                    index += 1 * direction;
                    currentName = element.name;
                    var res = {
                        name: element.name,
                        phone: element.contactInfo.phone
                    };
                    return res;
                }
                index += 1 * direction;
                currentName = element.name;
            }
            return null;
        },
        checkChanges: function () {
            if (collectionLength != Object.keys(collection).length) {
                data = getInvitedFriends(collection, startPoint, depth);
                length = data.length;
                this.findIndex();
            }
        },
        findIndex: function () {
            if (data.some(contact => contact.name === currentName)) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name === currentName) {
                        index = i;
                    }
                }
            }
        }
    };
};

var collectionLength;

function getInvitedFriends(collection, startPoint, depth) {
    collectionLength = Object.keys(collection).length;
    var invitedFriends = [];
    if (collection[startPoint] === undefined) {
        return invitedFriends;
    }
    var queue = [startPoint];
    var i = 0;
    while (true) {
        var foundFriends = [];
        while (queue.length != 0) {
            var currentFriend = queue.shift();
            if (collection[currentFriend] != undefined) {
                var friends = collection[currentFriend].friends.slice();
                friends = friends
                    .filter(function (friend) {
                        var isInvited = invitedFriends.some(contact => contact.name === friend);
                        var isFound = foundFriends.some(contact => contact.name === friend);
                        var isStartPoint = startPoint === friend;
                        var isRemoved = Object.keys(collection).indexOf(friend) === -1;
                        return !(isInvited || isFound || isStartPoint || isRemoved);
                    })
                    .sort()
                    .forEach(function (friend) {
                        var newContact = {
                            name: friend,
                            contactInfo: collection[friend],
                            addedFrom: currentFriend
                        };
                        foundFriends.push(newContact);
                    });
            }
        }
        invitedFriends = invitedFriends.concat(foundFriends);
        foundFriends.forEach(function (friend) {
            queue.push(friend.name);
        });
        i++;
        if (foundFriends.length === 0 || i == depth) {
            break;
        }
    }
    return invitedFriends;
}
