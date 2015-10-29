'use strict';

function newJSON(phone, friendName) {
    return {
        name: friendName,
        phone: phone
    };
}

function addToFriendsList(collection, friendsList, startPoint) {
    var friendsToAdd = [];
    for (var i in friendsList) {
        var candidates = collection[friendsList[i]]['friends'].sort();
        for (var j in candidates) {
            if (friendsList.indexOf(candidates[j]) === -1 && candidates[j] !== startPoint) {
                friendsToAdd.push(candidates[j]);
            }
        }
    }
    if (friendsToAdd.length) {
        return friendsToAdd;
    }
    return null;
}

function initializeList(collection, startPoint) {
    if (typeof startPoint === 'undefined' || Object.keys(collection).indexOf(startPoint) === -1) {
        return null;
    }
    return collection[startPoint]['friends'].sort();
}

module.exports.get = function (collection, startPoint, depth) {
    return {
        usersList: Object.keys(collection),
        friendsList: initializeList(collection, startPoint),
        iterationIndex: -1,
        numOfAdditions: 1,
        depth: depth || Infinity,
        next: function (friend) {
            if (Object.keys(collection).indexOf(startPoint) === -1) {
                return null;
            }
            if (!this.depth) {
                return;
            }
            this.iterationIndex += 1;
            var list = this.friendsList;
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

            var addedList = addToFriendsList(collection, list, startPoint);
            if (addedList && this.numOfAdditions < this.depth) {
                this.friendsList = list.concat(addedList);
                this.numOfAdditions += 1;
            }
            return newJSON(collection[list[this.iterationIndex]]['phone'],
                list[this.iterationIndex]);
        },
        nextMale: function () {
            if (!this.depth) {
                return;
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
            var addedList = addToFriendsList(collection, list, startPoint);
            if (addedList && this.numOfAdditions < this.depth) {
                this.friendsList = list.concat(addedList);
                this.numOfAdditions += 1;
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
