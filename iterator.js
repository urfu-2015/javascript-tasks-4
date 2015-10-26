'use strict';


module.exports.get = function (collection, startPoint, depth) {
    if (depth === undefined) {
        depth = 0;
        for (var contact in collection) {
            depth += 1;
        }
    }
    var data = getFriends(collection, startPoint, depth);
    var currentContact = 0;
    var lastContact = data.length;

    return {
        next: function (name) {
            if (collection[startPoint] === undefined || currentContact >= lastContact - 1) {
                return null;
            }
            if (name !== undefined) {
                while (true) {
                    var contact = data[currentContact];
                    if (currentContact >= lastContact - 1) {
                        return null;
                    }
                    if (contact.name === name) {
                        currentContact++;
                        return {
                            name: contact.name,
                            phone: contact.phone
                        };
                    }
                    currentContact++;
                }
            } else {
                var contact = data[currentContact];
                currentContact++;
                return {
                    name: contact.name,
                    phone: contact.phone
                };
            }
        },
        prev: function () {
            if (collection[startPoint] === undefined || currentContact < 2) {
                return null;
            }

            var contact = data[currentContact - 2];
            currentContact--;
            return {
                name: contact.name,
                phone: contact.phone
            };
        },
        nextMale: function () {
            if (collection[startPoint] === undefined || currentContact >= lastContact - 1) {
                return null;
            }
            while (true) {
                var contact = data[currentContact];
                if (contact.gender === 'Мужской') {
                    currentContact++;
                    return {
                        name: contact.name,
                        phone: contact.phone
                    };
                }
                currentContact++;
            }
        },
        prevMale: function () {
            if (collection[startPoint] === undefined || currentContact < 2) {
                return null;
            }

            while (true) {
                var contact = data[currentContact - 2];
                if (contact.gender === 'Мужской') {
                    currentContact--;
                    return {
                        name: contact.name,
                        phone: contact.phone
                    };
                }
                currentContact--;
            }
        }
    };
};

function isCheckList(contact, contactList) {
    for (var current = 0; current < contactList.length; current++) {
        if (contact === contactList[current]) {
            return true;
        }
    }
    return false;
}
function getFriends(collection, startPoint, depth) {
    var newFriends = [];
    if (collection[startPoint] === undefined) {
        return newFriends;
    }
    var nameFriends = [startPoint];
    var flag = true;
    var checkFriends = [];
    var depthFriends = [startPoint];
    while (depth > 0) {
        var currentFriends = [];
        nameFriends = depthFriends;
        depthFriends = [];
        while (nameFriends.length != 0) {
            var currentFriend = nameFriends.shift();
            var friendsOfFriends = [];
            var currentList = collection[currentFriend].friends.slice();
            for (var contact = 0; contact < currentList.length; contact++) {
                if (!(isCheckList(currentList[contact], checkFriends)) &&
                    currentList[contact] != startPoint) {
                    friendsOfFriends.push(currentList[contact]);
                    checkFriends.push(currentList[contact]);
                }
            }
            friendsOfFriends = friendsOfFriends.sort(function (contact1, contac2) {
                return contact1 > contac2 ? 1 : -1;
            });
            friendsOfFriends.forEach(function (friend) {
                if (friend !== startPoint) {
                    var newContact = {
                        name: friend,
                        gender: collection[friend].gender,
                        phone: collection[friend].phone,
                        friends: collection[friend].friends
                    };
                    currentFriends.push(newContact);
                }
            });
            var numberFriend = 0;
            while (numberFriend < friendsOfFriends.length) {
                if (startPoint != friendsOfFriends[numberFriend]) {
                    depthFriends.push(friendsOfFriends[numberFriend]);
                }
                numberFriend++;
            }
            if (nameFriends.length === 0) {
                flag = false;
            }
        }
        depth--;
    }
    checkFriends.forEach(function (friend) {
        if (friend !== startPoint) {
            var newContact = {
                name: friend,
                gender: collection[friend].gender,
                phone: collection[friend].phone,
                friends: collection[friend].friends
            };
            newFriends.push(newContact);
        }
    });
    return newFriends;

}
