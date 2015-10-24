'use strict';

module.exports.get = function (collection, startPoint, depth) {
    var index = 0;
    var data = getInvitedFriends(collection, startPoint, depth);
    var length = data.length;
    return {
        print: function () {
            data.forEach(function (contact) {
                console.log(contact.name);
            });
        },
        next: function (name) {
            if (collection[startPoint] === undefined) {
                return null;
            }
            var element;
            if (!this.hasNext() || !this.hasName(name) || startPoint === undefined ||
                collection[startPoint] === undefined) {
                return null;
            }
            while (this.hasNext()) {
                element = data[index];
                if (element.name === name || name === undefined) {
                    index += 1;
                    return element.contactInfo;
                }
                index += 1;
            }
            return null;
        },
        prev: function () {
            var element;
            if (!this.hasPrev() || startPoint === undefined) {
                return null;
            }
            element = data[index - 2];
            index -= 1;
            return element.contactInfo;
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
            while (func()) {
                element = data[index - step];
                if (element.contactInfo.gender === 'Мужской') {
                    index += 1 * direction;
                    return element.contactInfo;
                }
                index += 1 * direction;
            }
            return null;
        }
    };
};

function getInvitedFriends(collection, startPoint, depth) {
    var invitedFriends = [];
    if (collection[startPoint] === undefined) {
        return invitedFriends;
    }
    var queue = [startPoint];
    var toStop = false;
    var i = 0;
    while (!toStop) {
        var foundFriends = [];
        while (queue.length != 0) {
            var currentFriend = queue.shift();
            var friends = collection[currentFriend].friends.slice();
            friends = friends.filter(function (friend) {
                return !(invitedFriends.some(contact => contact.name === friend) ||
                    (foundFriends.some(contact => contact.name === friend)));
            });
            friends = friends.sort(function (a, b) {
                return a > b ? 1 : -1;
            });
            friends.forEach(function (friend) {
                var newContact = {
                    name: friend,
                    contactInfo: collection[friend],
                    addedFrom: currentFriend
                };
                foundFriends.push(newContact);
            });
        }
        if (foundFriends.length === 0 || i == depth) {
            toStop = true;
        } else {
            invitedFriends = invitedFriends.concat(foundFriends);
            foundFriends.forEach(function (friend) {
                queue.push(friend.name);
            });
        }
        i++;
    }
    return invitedFriends;
}
