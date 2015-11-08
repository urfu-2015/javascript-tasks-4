'use strict';

function newJSON(phone, friendName) {
    return {
        name: friendName,
        phone: phone
    };
}

function addToFriendsList(collection, friendsList) {
    var friendsToAdd = [];
    for (var i in friendsList) {
        var candidates = Object.assign([], collection[friendsList[i]]['friends']).sort();
        for (var j in candidates) {
            if (friendsList.indexOf(candidates[j]) === -1 &&
                friendsToAdd.indexOf(candidates[j]) === -1) {
                friendsToAdd.push(candidates[j]);
            }
        }
    }
    if (friendsToAdd.length) {
        return friendsToAdd;
    }
    return null;
}

function initializeList(collection, startPoint, depth) {
    if (typeof startPoint === 'undefined' || Object.keys(collection).indexOf(startPoint) === -1 ||
    depth < 0) {
        return null;
    }
    if (typeof depth === 'undefined') {
        depth = Infinity;
    }
    var result = [startPoint];
    if (depth === 0) {
        return result;
    }
    var added = addToFriendsList(collection, result);
    var i = 0;
    while (added && i < depth) {
        result.push.apply(result, added);
        added = addToFriendsList(collection, result);
        i++;
    }
    return result;
}

module.exports.get = function (collection, startPoint, depth) {
    return {
        depth: depth || Infinity,
        friendsList: initializeList(collection, startPoint, depth),
        iterationIndex: 0,
        next: function (friend) {
            if (Object.keys(collection).indexOf(startPoint) === -1) {
                return null;
            }
            var list = this.friendsList;
            if (list === null) {
                return null;
            }
            this.iterationIndex += 1;

            if (typeof friend !== 'undefined') {
                for (var i = this.iterationIndex; i < list.length; i++) {
                    if (list[i] === friend) {
                        return newJSON(collection[friend]['phone'], friend);
                    }
                    this.iterationIndex += 1;
                }
            }
            if (this.iterationIndex >= list.length) {
                return null;
            }
            return newJSON(collection[list[this.iterationIndex]]['phone'],
                list[this.iterationIndex]);
        },
        nextMale: function () {
            if (this.depth < 0) {
                return null;
            }
            this.iterationIndex += 1;
            var list = this.friendsList;
            while (this.iterationIndex < list.length) {
                if (collection[list[this.iterationIndex]]['gender'] !== 'Мужской') {
                    this.iterationIndex += 1;
                } else {
                    break;
                }
            }
            if (this.iterationIndex >= list.length) {
                return null;
            }

            return newJSON(collection[list[this.iterationIndex]]['phone'],
                list[this.iterationIndex]);
        },
        prev: function (friend) {
            if (Object.keys(collection).indexOf(startPoint) === -1) {
                return null;
            }
            this.iterationIndex -= 1;
            var list = this.friendsList;
            if (typeof friend !== 'undefined') {
                for (var i = this.iterationIndex; i >= 0; i--) {
                    if (list[i] === friend) {
                        return newJSON(collection[friend]['phone'], friend);
                    }
                    this.iterationIndex -= 1;
                }
            }
            if (this.iterationIndex < 0) {
                return null;
            }
            return newJSON(collection[list[this.iterationIndex]]['phone'],
                list[this.iterationIndex]);
        },
        prevMale: function () {
            this.iterationIndex -= 1;
            var list = this.friendsList;
            while (this.iterationIndex >= 0) {
                if (collection[list[this.iterationIndex]]['gender'] !== 'Мужской') {
                    this.iterationIndex -= 1;
                } else {
                    break;
                }
            }
            if (this.iterationIndex < 0) {
                return null;
            }
            return newJSON(collection[list[this.iterationIndex]]['phone'],
                list[this.iterationIndex]);
        }
    };
};
