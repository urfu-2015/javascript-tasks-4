'use strict';

module.exports.get = function (collection, startPoint, depth) {
    return {
        friends: getAllFriends(collection, startPoint, depth),
        currentFriendId: 0,
        next: function (name) {
            checkCollectionChange.call(this, collection, startPoint, depth);
            if (this.currentFriendId > this.friends.length - 2) {
                return null;
            }
            return getData.call(this, collection, name, 1);
        },
        nextMale: function (name) {
            return getMale.call(this, collection, this.next, name);
        },
        prev: function (name) {
            checkCollectionChange.call(this, collection, startPoint, depth);
            if (this.currentFriendId === 0) {
                return null;
            }
            return getData.call(this, collection, name, -1);
        },
        prevMale: function (name) {
            return getMale.call(this, collection, this.prev, name);
        }
    };
};

function getData(collection, name, step) {
    if (!name) {
        this.currentFriendId += step;
        name = this.friends[this.currentFriendId];
    } else {
        this.currentFriendId = this.friends.indexOf(name);
    }
    var friend = collection[name];
    friend.name = name;
    return friend;
}

function getMale(collection, fun, name) {
    var next = fun.call(this, name);
    console.log('next', next);
    while (next && collection[next.name].gender != 'Мужской') {
        next = fun.call(this, name);
    }
    return next;
}

function getAllFriends(collection, startPoint, depth) {
    if (Object.keys(collection).indexOf(startPoint) == -1) {
        return [];
    }
    depth = depth || Object.keys(collection).length;
    var allFriends = [];
    var currentDepth = -1;
    var currentFriends = [startPoint];
    while (currentDepth < depth && !currentFriends.isEmpty) {
        currentFriends = currentFriends.filter(function (friend) {
            return allFriends.indexOf(friend) === -1 &&
                Object.keys(collection).indexOf(friend) > -1;
        });
        currentFriends.map(function (name) {
            allFriends.push(name);
        });
        currentFriends = currentFriends.reduce(function (friends, name) {
            var contactFriends = collection[name].friends;
            contactFriends = contactFriends.filter(function (name) {
                return friends.indexOf(name) == -1;
            });
            return friends.concat(contactFriends.sort());
        }, []);
        currentDepth += 1;
    }
    return allFriends;
}

function checkCollectionChange(collection, startPoint, depth) {
    if (this.friends.every(function (name) {
            return Object.keys(collection).indexOf(name) > -1;
        })) {
        return true;
    }
    var currentName = this.friends[this.currentFriendId];
    this.friends = getAllFriends(collection, startPoint, depth);
    this.currentFriendId = this.friends.indexOf(currentName);
}

function cloneContact(contact) {
    var fields = Object.keys(contact);
    return fields.reduce(function (newContact, field) {
        if (field === 'friends') {
            newContact.friends = contact.friends.map(function (friend) {
                return friend;
            });
            return newContact;
        }
        newContact[field] = contact[field];
        return newContact;
    }, {});
}
